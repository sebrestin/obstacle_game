module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './scripts/main.ts',
    output: {
      path: __dirname,
      filename: 'dist/app.js'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        { 
            test: /\.ts$/,
            use: 'ts-loader'
        }
      ]
    }
  }