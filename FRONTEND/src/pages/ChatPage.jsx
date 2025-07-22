import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken, getUserFriends } from "../lib/api";
import { getUserAvatar } from "../utils/avatar";

import {
  Channel,
  Chat,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import CustomMessageList from "../components/CustomMessageList";
import { ArrowLeftIcon } from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const navigate = useNavigate();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthUser();

  const { data: tokenData, refetch: refetchToken } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
    staleTime: 0, // Always fetch fresh token
    cacheTime: 0, // Don't cache tokens
  });

  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    enabled: !!authUser,
  });

  // Find the friend we're chatting with
  const currentFriend = friends.find(friend => friend._id === targetUserId);

  useEffect(() => {
    let isMounted = true;

    const initChat = async () => {
      // Wait for all required data
      if (!tokenData?.token || !authUser || !targetUserId) {
        console.log('Waiting for required data...', {
          hasToken: !!tokenData?.token,
          hasAuthUser: !!authUser,
          hasTargetUserId: !!targetUserId
        });
        return;
      }

      try {
        setLoading(true);
        console.log('Initializing Stream Chat client...');

        // Create a fresh client instance
        const client = StreamChat.getInstance(STREAM_API_KEY);

        // Ensure clean state - disconnect any existing connection
        try {
          if (client.userID) {
            console.log('Disconnecting existing user:', client.userID);
            await client.disconnectUser();
          }
        } catch (disconnectError) {
          console.log('Disconnect error (expected):', disconnectError.message);
        }

        // Small delay to ensure clean state
        await new Promise(resolve => setTimeout(resolve, 100));

        // Connect user
        console.log('Connecting user:', authUser._id);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: getUserAvatar(authUser),
          },
          tokenData.token
        );

        console.log('User connected successfully, userID:', client.userID);

        if (!isMounted) return;

        // Create and watch channel
        const channelId = [authUser._id, targetUserId].sort().join("-");
        console.log('Creating channel:', channelId);

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        console.log('Watching channel...');
        await currChannel.watch();
        console.log('Channel ready');

        if (!isMounted) return;

        setChatClient(client);
        setChannel(currChannel);
        setLoading(false);
      } catch (error) {
        console.error("Error initializing chat:", error);
        if (isMounted) {
          // Try one more time after a short delay
          console.log('Retrying chat initialization...');
          setTimeout(async () => {
            try {
              await refetchToken();
              // The useEffect will trigger again with fresh token
            } catch (retryError) {
              console.error('Retry failed:', retryError);
              toast.error("Could not connect to chat. Please refresh the page.");
            }
          }, 1000);
          setLoading(false);
        }
      }
    };

    // Add a small delay before initializing to ensure all data is ready
    const timer = setTimeout(initChat, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [tokenData?.token, authUser?._id, targetUserId, refetchToken]);

  // Additional cleanup on component unmount
  useEffect(() => {
    return () => {
      if (chatClient && chatClient.userID) {
        chatClient.disconnectUser().catch(console.error);
      }
    };
  }, [chatClient]);



  const handleVideoCall = () => {
    if (channel) {
      const currentChatPath = `/chat/${targetUserId}`;
      const callUrl = `${window.location.origin}/call/${channel.id}?returnTo=${encodeURIComponent(currentChatPath)}`;
      channel.sendMessage({
        text: `🎥 Video Call Started! Join here: ${callUrl}`,
      });
      toast.success("Video call link sent!");
    }
  };

  const handleBackClick = () => {
    navigate('/friends');
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="w-full h-full bg-base-100">
      {/* Back Arrow Button - Outside chat card */}
      <div className="p-2 sm:p-4 pb-0">
        <button
          onClick={handleBackClick}
          className="btn btn-sm btn-ghost hover:btn-base-200 transition-all duration-200 flex items-center gap-2"
          title="Back to Friends"
        >
          <ArrowLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
        </button>
      </div>

      <div className="h-[calc(100vh-6rem)] sm:h-[calc(100vh-8rem)] px-2 sm:px-4 pb-2 sm:pb-4">
        <Chat client={chatClient}>
          <Channel channel={channel}>
            <div className="w-full h-full relative rounded-lg sm:rounded-xl overflow-hidden bg-base-100 border border-base-content/10 shadow-lg">
              <CallButton handleVideoCall={handleVideoCall} friend={currentFriend} />
              <Window>
                <CustomMessageList />
                <MessageInput focus />
              </Window>
              <Thread />
            </div>
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default ChatPage;
