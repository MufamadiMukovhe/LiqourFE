// webpack.config.js
const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'), // Polyfill for 'path'
      crypto: require.resolve('crypto-browserify'), // Polyfill for 'crypto'
      stream: require.resolve('stream-browserify'), // Polyfill for 'stream'
      vm: require.resolve('vm-browserify'), // Polyfill for 'vm'
      fs: false, // Ignore 'fs' module
    },
  },
};
