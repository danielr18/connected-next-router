const webpack = require('webpack');
module.exports = {
  webpack(config) {
    // Allows to mock process.env.NODE_ENV from tests
    config.plugins.filter(p => p instanceof webpack.DefinePlugin).forEach(plugin => {
      plugin.definitions['process.env.NODE_ENV'] = `("NODE_ENV" in window ? window["NODE_ENV"] : "${process.env.NODE_ENV}")`
    });
    return config;
  },
};
