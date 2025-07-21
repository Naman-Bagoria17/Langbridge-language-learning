import { useChatContext } from 'stream-chat-react';

const CustomMessage = ({ message }) => {
  const { client } = useChatContext();
  const isOwn = message.user?.id === client.userID;

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to render text with clickable links
  const renderMessageText = (text) => {
    // Regular expression to detect URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        // Check if it's an internal video call link
        const isInternalLink = part.includes(window.location.origin);

        return (
          <a
            key={index}
            href={part}
            target={isInternalLink ? "_self" : "_blank"}
            rel={isInternalLink ? "" : "noopener noreferrer"}
            className={`underline hover:no-underline font-medium ${isOwn ? 'text-primary-content' : 'text-primary'
              }`}
          >
            {isInternalLink ? " Join Video Call" : part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className={`flex w-full mb-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl shadow-sm ${isOwn
          ? 'bg-primary text-primary-content rounded-br-md'
          : 'bg-base-200 text-base-content rounded-bl-md'
          }`}
      >
        {/* Message Text and Timestamp in same line */}
        <div className="flex items-end gap-2">
          <div className="text-sm leading-relaxed flex-1">
            {renderMessageText(message.text)}
          </div>
          <div
            className={`text-xs flex-shrink-0 ${isOwn ? 'text-primary-content/70' : 'text-base-content/60'
              }`}
          >
            {formatTime(message.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomMessage;
