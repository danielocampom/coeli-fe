const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    disableHostCheck: true,
    // public: 'coeli-be-run-z34ajjggwa-uc.a.run.app'
  }
})
