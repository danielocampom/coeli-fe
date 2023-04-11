const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // disableHostCheck: true,
    host: 'coeli-fe-z34ajjggwa-uc.a.run.app'
  }
})
