const path = require('path')
const externalsRegExp = /(connected-next-router)(?!.*node_modules)/

/*
  WARNING: This configuration is only needed if you are testing the
  example with "npm link". You don't need to have this config in your app!
*/
module.exports = {
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react-redux': path.resolve(__dirname, 'node_modules/react-redux'),
      redux: path.resolve(__dirname, 'node_modules/redux'),
      next: path.resolve(__dirname, 'node_modules/next')
    }

    config.externals = config.externals.map(external => {
      if (typeof external !== 'function') return external
      return (ctx, req, cb) => (externalsRegExp.test(req) ? cb() : external(ctx, req, cb))
    })

    return config
  }
}
