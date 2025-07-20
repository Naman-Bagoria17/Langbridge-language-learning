import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { getUserAvatar } from "../utils/avatar";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 p-6 space-y-4 hover:bg-base-300 h-full">
      {/* Avatar and Name */}
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img
              src={getUserAvatar(friend)}
              alt={friend.fullName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <h3 className="font-semibold text-base-content truncate">{friend.fullName}</h3>
      </div>

      {/* Languages */}
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="badge badge-primary gap-1">
          {getLanguageFlag(friend.nativeLanguage)} Native: {friend.nativeLanguage}
        </span>
        <span className="badge badge-secondary gap-1">
          {getLanguageFlag(friend.learningLanguage)} Learning: {friend.learningLanguage}
        </span>
      </div>

      {/* Message Button */}
      <Link
        to={`/chat/${friend._id}`}
        className="btn btn-primary w-full"
      >
        Message
      </Link>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
