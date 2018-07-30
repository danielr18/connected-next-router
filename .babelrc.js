module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: process.env.BABEL_ENV === 'es' ? false : 'commonjs'
      }
    ],
    'next/babel'
  ]
}
