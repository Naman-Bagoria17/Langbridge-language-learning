import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { getUserAvatar } from "../utils/avatar";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let client = null;
    let isMounted = true;

    const initChat = async () => {
      if (!tokenData?.token || !authUser || !targetUserId) {
        setLoading(false);
        return;
      }

      try {
        client = StreamChat.getInstance(STREAM_API_KEY);

        // Check if user is already connected
        if (client.userID && client.userID !== authUser._id) {
          await client.disconnectUser();
        }

        // Only connect if not already connected as this user
        if (!client.userID || client.userID !== authUser._id) {
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: getUserAvatar(authUser),
            },
            tokenData.token
          );
        }

        if (!isMounted) return; // Component unmounted during async operation

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        if (!isMounted) return; // Component unmounted during async operation

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        if (isMounted) {
          toast.error("Could not connect to chat.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initChat();

    // Cleanup function
    return () => {
      isMounted = false;
      if (client && client.userID) {
        client.disconnectUser().catch(console.error);
      }
    };
  }, [tokenData?.token, authUser?._id, targetUserId]);

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
        text: `🎥 Video Call Started!\n\nClick the link below to join:\n${callUrl}\n\n💡 Make sure your camera and microphone are ready!`,
      });
      toast.success("Video call link sent!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="w-full h-full bg-base-100">
      <div className="h-[calc(100vh-4rem)]">
        <Chat client={chatClient}>
          <Channel channel={channel}>
            <div className="w-full h-full relative rounded-xl overflow-hidden bg-base-100 border border-base-content/10 shadow-lg">
              <CallButton handleVideoCall={handleVideoCall} />
              <Window>
                <ChannelHeader />
                <MessageList />
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
