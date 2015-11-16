const srcFiles = [
  /src/
]

module.exports = {

  /**
   * You can read this like:
   *   make this: out of this
   */
  entry: {
    './build/js/bundle.js': './src/js/index.js'
  },
  output: { filename: '[name]' },

  module: {
    loaders: [

      /**
       * Run the babel loader on all your src .js and .jsx files.
       */
      { test: /\.js(x)?$/, include: srcFiles, loaders: ['babel'] }

    ]
  }

}
