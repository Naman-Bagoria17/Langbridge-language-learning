import { useChannelStateContext } from 'stream-chat-react';
import { useEffect, useRef } from 'react';
import CustomMessage from './CustomMessage';

const CustomMessageList = () => {
  const { messages } = useChannelStateContext();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter out system messages and only show regular messages
  const regularMessages = messages.filter(
    (message) => message.type === 'regular' && !message.deleted_at
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 pt-20 space-y-1">
      {regularMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-base-content/60 text-sm">
              No messages yet. Start the conversation!
            </p>
          </div>
        </div>
      ) : (
        <>
          {regularMessages.map((message) => (
            <CustomMessage
              key={message.id}
              message={message}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default CustomMessageList;
