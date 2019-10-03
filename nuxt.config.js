module.exports = {
  mode: 'universal',

  head: {
    title: 'CouponDemo ÐApp - The Rouge Project',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'The Coupon Demo ÐApp by the Rouge Project -' },
      { name: 'theme-color', content: '#ffffff' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@rougetoken' },
      { name: 'og:url', content: 'https://rouge.network/' },
      { name: 'og:title', content: 'CouponDemo ÐApp - The Rouge Project' },
      { name: 'og:image', content: 'https://rouge.network/images/demo0.4.png' },
      { name: 'og:description', content: 'CouponDemo ÐApp by the Rouge Project - ' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'mask-icon', color: '#5bbad5', href: '/safari-pinned-tab.svg' }
    ]
  },
  plugins: [
  ],
  router: {
  },
  modules: [
    '@nuxtjs/font-awesome',
    'vue-ethereum/nuxt'
  ],
  /*
  ** Customize the progress-bar color
  */
  loading: '~components/Loading.vue',
  // loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLINT on save
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        })
      }
    }
  }
}
