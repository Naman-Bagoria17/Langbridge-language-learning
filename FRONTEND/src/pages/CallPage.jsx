import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { getUserAvatar } from "../utils/avatar";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let videoClient = null;
    let callInstance = null;
    let isMounted = true;

    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) {
        setIsConnecting(false);
        return;
      }

      try {
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: getUserAvatar(authUser),
        };

        videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        if (!isMounted) return; // Component unmounted during async operation

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error initializing call:", error);
        if (isMounted) {
          toast.error("Could not join the call.");
        }
      } finally {
        if (isMounted) {
          setIsConnecting(false);
        }
      }
    };

    initCall();

    // Cleanup function
    return () => {
      isMounted = false;
      if (callInstance) {
        callInstance.leave().catch(console.error);
      }
      if (videoClient) {
        videoClient.disconnectUser().catch(console.error);
      }
    };
  }, [tokenData?.token, authUser?._id, callId]);

  // Additional cleanup on component unmount
  useEffect(() => {
    return () => {
      if (call) {
        call.leave().catch(console.error);
      }
      if (client) {
        client.disconnectUser().catch(console.error);
      }
    };
  }, [client, call]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="min-h-screen bg-base-100">
      <div className="w-full h-screen">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-base-content/70">Could not initialize call.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      // Check for return path in URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const returnTo = urlParams.get('returnTo');

      const timer = setTimeout(() => {
        try {
          if (returnTo) {
            // Navigate back to the specified path (e.g., chat page)
            const decodedPath = decodeURIComponent(returnTo);
            console.log('Navigating back to:', decodedPath);
            navigate(decodedPath, { replace: true });
          } else {
            // Default to home page
            console.log('Navigating to home page');
            navigate("/", { replace: true });
          }
        } catch (error) {
          console.error('Navigation error:', error);
          // Fallback to home page
          navigate("/", { replace: true });
        }
      }, 1000); // Reduced delay for better mobile experience

      // Cleanup timer on unmount
      return () => clearTimeout(timer);
    }
  }, [callingState, navigate]);

  if (callingState === CallingState.LEFT) {
    const urlParams = new URLSearchParams(window.location.search);
    const returnTo = urlParams.get('returnTo');

    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100 p-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <h3 className="text-lg sm:text-xl font-semibold text-base-content mb-2">Call Ended</h3>
          <div className="space-y-2">
            <p className="text-sm sm:text-base text-base-content/70">
              {returnTo && returnTo.includes('/chat/')
                ? "Returning to chat..."
                : "Returning to home page..."
              }
            </p>
            <p className="text-xs text-base-content/50">
              Please wait...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StreamTheme>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        {/* Video Layout - with padding bottom to avoid controls overlap */}
        <div className="flex-1 relative pb-20">
          <SpeakerLayout />
        </div>

        {/* Fixed Controls at Bottom */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-black/30 backdrop-blur-md rounded-full px-4 py-2 shadow-lg">
          <CallControls />
        </div>
      </div>
    </StreamTheme>
  );
};

export default CallPage;
