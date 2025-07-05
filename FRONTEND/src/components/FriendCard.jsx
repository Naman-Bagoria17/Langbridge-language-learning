import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4 space-y-4 hover:bg-slate-700">
      {/* Avatar and Name */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400">
          <img
            src={friend.profilePic}
            alt={friend.fullName}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-semibold text-white truncate">{friend.fullName}</h3>
      </div>

      {/* Languages */}
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-600 text-white rounded-full text-xs font-medium">
          {getLanguageFlag(friend.nativeLanguage)} Native: {friend.nativeLanguage}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-600 text-white rounded-full text-xs font-medium">
          {getLanguageFlag(friend.learningLanguage)} Learning: {friend.learningLanguage}
        </span>
      </div>

      {/* Message Button */}
      <Link
        to={`/chat/${friend._id}`}
        className="block w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white py-2 px-4 rounded-lg font-medium text-center transition-colors"
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
