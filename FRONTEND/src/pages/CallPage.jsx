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
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="w-full max-w-7xl h-[90vh] rounded-lg overflow-hidden shadow-xl">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <p className="text-center text-base-content/70">Could not initialize call.</p>
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

      setTimeout(() => {
        if (returnTo) {
          // Navigate back to the specified path (e.g., chat page)
          navigate(decodeURIComponent(returnTo));
        } else {
          // Default to home page
          navigate("/");
        }
      }, 1500); // Delay to ensure call cleanup
    }
  }, [callingState, navigate]);

  if (callingState === CallingState.LEFT) {
    const urlParams = new URLSearchParams(window.location.search);
    const returnTo = urlParams.get('returnTo');

    return (
      <div className="flex items-center justify-center h-full bg-base-100">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <h3 className="text-lg font-semibold text-base-content mb-2">Call Ended</h3>
          <div className="space-y-2">
            <p className="text-base-content/70">
              {returnTo && returnTo.includes('/chat/')
                ? "Returning to chat..."
                : "Returning to home page..."
              }
            </p>
            <p className="text-xs text-base-content/50">
              Thank you for using our video call feature! 🎥
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;
