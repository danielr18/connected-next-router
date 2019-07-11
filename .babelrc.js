module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: process.env.BABEL_ENV === 'es' ? false : 'commonjs'
      }
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties'
  ]
}
