// Learn more: https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow importing .sql migration files as text if needed later.
config.resolver.sourceExts.push('sql');

module.exports = config;
