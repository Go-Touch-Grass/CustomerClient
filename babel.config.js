module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],  // or 'module:metro-react-native-babel-preset'
    plugins: [
      'react-native-reanimated/plugin',  // This should be the first plugin
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: true,
        }
      ]
    ]
  };
};
