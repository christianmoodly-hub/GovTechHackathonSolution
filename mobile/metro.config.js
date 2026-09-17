const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
// OneDrive can delete/move nested node_modules mid-watch and crash Metro's FSWatcher.
config.watchFolders = [__dirname];
config.resolver.blockList = [
  ...(config.resolver.blockList ?? []),
];
module.exports = config;
