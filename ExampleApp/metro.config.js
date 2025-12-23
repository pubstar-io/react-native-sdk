const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  watchFolders: [
    path.resolve(__dirname, '../RTNPubstar'),
  ],
  resolver: {
    ...defaultConfig.resolver,
    extraNodeModules: {
      'rtn-pubstar': path.resolve(__dirname, '../RTNPubstar'),
      '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
    },
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
    ],
  },
};

module.exports = mergeConfig(defaultConfig, config);
