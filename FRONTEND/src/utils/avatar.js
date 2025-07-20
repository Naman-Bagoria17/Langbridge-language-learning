// Avataaars API configuration
const AVATAAARS_BASE_URL = 'https://avataaars.io/';

// Avatar style options for randomization
const AVATAR_OPTIONS = {
  avatarStyle: ['Circle', 'Transparent'],
  topType: [
    'NoHair', 'Eyepatch', 'Hat', 'Hijab', 'Turban', 'WinterHat1', 'WinterHat2', 'WinterHat3', 'WinterHat4',
    'LongHairBigHair', 'LongHairBob', 'LongHairBun', 'LongHairCurly', 'LongHairCurvy', 'LongHairDreads',
    'LongHairFrida', 'LongHairFro', 'LongHairFroBand', 'LongHairNotTooLong', 'LongHairShavedSides',
    'LongHairMiaWallace', 'LongHairStraight', 'LongHairStraight2', 'LongHairStraightStrand',
    'ShortHairDreads01', 'ShortHairDreads02', 'ShortHairFrizzle', 'ShortHairShaggyMullet',
    'ShortHairShortCurly', 'ShortHairShortFlat', 'ShortHairShortRound', 'ShortHairShortWaved',
    'ShortHairSides', 'ShortHairTheCaesar', 'ShortHairTheCaesarSidePart'
  ],
  accessoriesType: ['Blank', 'Kurt', 'Prescription01', 'Prescription02', 'Round', 'Sunglasses', 'Wayfarers'],
  hairColor: ['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'PastelPink', 'Platinum', 'Red', 'SilverGray'],
  facialHairType: ['Blank', 'BeardMedium', 'BeardLight', 'BeardMajestic', 'MoustacheFancy', 'MoustacheMagnum'],
  clotheType: [
    'BlazerShirt', 'BlazerSweater', 'CollarSweater', 'GraphicShirt', 'Hoodie', 'Overall',
    'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck'
  ],
  eyeType: ['Close', 'Cry', 'Default', 'Dizzy', 'EyeRoll', 'Happy', 'Hearts', 'Side', 'Squint', 'Surprised', 'Wink', 'WinkWacky'],
  eyebrowType: ['Angry', 'AngryNatural', 'Default', 'DefaultNatural', 'FlatNatural', 'RaisedExcited', 'RaisedExcitedNatural', 'SadConcerned', 'SadConcernedNatural', 'UnibrowNatural', 'UpDown', 'UpDownNatural'],
  mouthType: ['Concerned', 'Default', 'Disbelief', 'Eating', 'Grimace', 'Sad', 'ScreamOpen', 'Serious', 'Smile', 'Tongue', 'Twinkle', 'Vomit'],
  skinColor: ['Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black']
};

/**
 * Generate a deterministic avatar based on a seed string
 * @param {string} seed - Seed string (email, username, etc.)
 * @returns {Object} Avatar configuration object
 */
const generateDeterministicAvatar = (seed) => {
  // Simple hash function to convert string to number
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use hash to deterministically select avatar options
  const config = {};
  Object.keys(AVATAR_OPTIONS).forEach((key, index) => {
    const options = AVATAR_OPTIONS[key];
    const seedValue = Math.abs(hash + index * 1000);
    config[key] = options[seedValue % options.length];
  });

  return config;
};

/**
 * Generate a random avatar configuration
 * @returns {Object} Random avatar configuration
 */
export const generateRandomAvatar = () => {
  const config = {};
  Object.keys(AVATAR_OPTIONS).forEach(key => {
    const options = AVATAR_OPTIONS[key];
    config[key] = options[Math.floor(Math.random() * options.length)];
  });
  return config;
};

/**
 * Convert avatar configuration to URL
 * @param {Object} config - Avatar configuration object
 * @returns {string} Avataaars URL
 */
export const avatarConfigToUrl = (config) => {
  const params = new URLSearchParams(config);
  return `${AVATAAARS_BASE_URL}?${params.toString()}`;
};

/**
 * Generate an Avataaars avatar URL based on user identifier
 * @param {string} identifier - Unique identifier (email, username, or ID)
 * @returns {string} Avataaars URL
 */
export const generateAvataaarsAvatar = (identifier) => {
  if (!identifier) {
    identifier = 'default-user';
  }

  const cleanIdentifier = identifier.toLowerCase().trim();
  const config = generateDeterministicAvatar(cleanIdentifier);
  return avatarConfigToUrl(config);
};

/**
 * Get avatar URL for a user object
 * @param {Object} user - User object with email, _id, fullName, or avatarConfig
 * @returns {string} Avatar URL
 */
export const getUserAvatar = (user) => {
  if (!user) return generateAvataaarsAvatar('anonymous');

  // If user has a custom avatar configuration, use it
  if (user.avatarConfig) {
    return avatarConfigToUrl(user.avatarConfig);
  }

  // If user has a profilePic URL, use it (for backward compatibility)
  if (user.profilePic && user.profilePic.startsWith('http')) {
    return user.profilePic;
  }

  // Generate deterministic avatar based on email, _id, or fullName
  const identifier = user.email || user._id || user.fullName || 'anonymous';
  return generateAvataaarsAvatar(identifier);
};

/**
 * Generate a random avatar URL
 * @returns {string} Random Avataaars URL
 */
export const getRandomAvatar = () => {
  const config = generateRandomAvatar();
  return avatarConfigToUrl(config);
};
