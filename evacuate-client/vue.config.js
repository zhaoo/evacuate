module.exports = {
  publicPath: './',
  devServer: {
    open: true,
    overlay: {
      warnings: true,
      errors: true
    }
    // proxy: {
    //   [process.env.VUE_APP_BASE_URL]: {
    //     target: `http://127.0.0.1:7001/api`,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       ['^' + process.env.VUE_APP_BASE_URL]: ''
    //     }
    //   }
    // }
  }
}
