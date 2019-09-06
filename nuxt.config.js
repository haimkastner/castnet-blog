const builtAt = new Date().toISOString()
const path = require('path')
const fse = require('fs-extra')
const { I18N } = require('./locales/i18n-nuxt-config')
import blogsEn from './contents/en/blogsEn.js'
import blogsHe from './contents/he/blogsHe.js'

const productionUrl = {
  en: "/en",
  he: "/he"
};
const baseUrl = 'https://blog.castnet.club';

module.exports = {
  env: {
    baseUrl,
    productionUrl
  },
  head: {
    title: 'Haim Kastner | Thoughts on coding and development',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no' },
      { name: 'msapplication-TileColor', content: '#ffffff' },
      { name: 'msapplication-TileImage', content: '/favicons/mstile-144x144.png' },
      { name: 'theme-color', content: '#c1c1c1' },
      { name: 'robots', content: 'index, follow' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@hkastnet' },
      { property: 'og:type', content: 'profile' },
      { property: 'og:updated_time', content: builtAt }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicons/favicon-16x16.png', sizes: '16x16' },
      { rel: 'icon', type: 'image/png', href: '/favicons/favicon-32x32.png', sizes: '32x32' },
      { rel: 'icon', type: 'image/png', href: '/favicons/android-chrome-96x96.png', sizes: '96x96' },
      { rel: 'icon', type: 'image/png', href: '/favicons/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-57x57.png', sizes: '57x57' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-60x60.png', sizes: '60x60' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-72x72.png', sizes: '72x72' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-76x76.png', sizes: '76x76' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-114x114.png', sizes: '114x114' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-120x120.png', sizes: '120x120' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-144x144.png', sizes: '144x144' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-152x152.png', sizes: '152x152' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-180x180.png', sizes: '180x180' },
      { rel: 'mask-icon', type: 'image/png', href: '/favicons/safari-pinned-tab.svg', color: '#c1c1c1' },
      { rel: 'manifest', href: '/manifest.json' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#5a46ff',
    height: '3px'
  },
  /*
  ** Build configuration
  */
  css: [
    'normalize.css/normalize.css',
    '@/assets/css/main.scss'
  ],

  build: {
    extend (config) {
      const rule = config.module.rules.find(r => r.test.toString() === '/\\.(png|jpe?g|gif|svg|webp)$/i')
      config.module.rules.splice(config.module.rules.indexOf(rule), 1)

      config.module.rules.push({
        test: /\.md$/,
        loader: 'frontmatter-markdown-loader',
        include: path.resolve(__dirname, 'contents'),
        options: {
          vue: {
            root: "dynamicMarkdown"
          }
        }
      }, {
          test: /\.(jpe?g|png)$/i,
          loader: 'responsive-loader',
          options: {
            placeholder: true,
            quality: 60,
            size: 1400,
            adapter: require('responsive-loader/sharp')
          }
        }, {
          test: /\.(gif|svg)$/,
          loader: 'url-loader',
          query: {
            limit: 1000,
            name: 'img/[name].[hash:7].[ext]'
          }
        });
    }
  },
  plugins: ['~/plugins/lazyload', '~/plugins/globalComponents', { src: '~plugins/ga.js', ssr: false }],
  modules: [
    '@nuxtjs/style-resources',
    'nuxt-webfontloader',
    '@nuxtjs/feed',
    ['nuxt-i18n', I18N]
  ],
  feed: [
    {
      path: '/feed', // The route to your feed.
      async create(feed) {
        feed.options = {
          title: "בלוג מחשבות על קידוד ופיתוח",
          description: "בלוג מחשבות על קידוד ופיתוח, התוכן באחריות קורא המחשבות",
          id: "https://blog.castnet.club/",
          link: "https://blog.castnet.club/",
          language: "he", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
          image: "https://blog.castnet.club/favicons/android-chrome-192x192.png",
          favicon: "https://blog.castnet.club/favicons/favicon.ico",
          copyright: `All rights reserved ${new Date().getFullYear()}, Haim Kastner`,
          // generator: "awesome", // optional, default = 'Feed for Node.js'
          author: {
            name: "Haim Kastner",
            email: "haim.kastner@gmail.com",
            link: "https://twitter.com/hkastnet"
          }
        }
      
        blogsHe.forEach(article => {
          const articalRawContent = fse.readFileSync(`./contents/he/blog/${article}.md`, "utf8");
          const articalHeaders = articalRawContent.split('---')[1].split(/\r?\n/);
          
          let title = article;
          let description = article;
          for (const header of articalHeaders) {
            if(header.indexOf('title') === 0){
              title = header.split(':')[1];
            }
            if(header.indexOf('description') === 0){
              description = header.split(':')[1];
            }
          }
          
          feed.addItem({
            title,
            link: `https://blog.castnet.club/blog/${article}`,
            description,
          })
        })
      
        feed.addCategory('software development')
      },
      type: 'rss2', // Can be: rss2, atom1, json1
    },
    {
      path: '/en/feed', // The route to your feed.
      async create(feed) {
        feed.options = {
          title: "Coding and Development Thoughts Blog",
          description: "Coding and Development Thoughts Blog, The Content is on the responsibility of the mind reader",
          id: "https://blog.castnet.club/en",
          link: "https://blog.castnet.club/en",
          language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
          image: "https://blog.castnet.club/favicons/android-chrome-192x192.png",
          favicon: "https://blog.castnet.club/favicons/favicon.ico",
          copyright: `All rights reserved ${new Date().getFullYear()}, Haim Kastner`,
          // generator: "awesome", // optional, default = 'Feed for Node.js'
          author: {
            name: "Haim Kastner",
            email: "haim.kastner@gmail.com",
            link: "https://twitter.com/hkastnet"
          }
        }
      
        blogsEn.forEach(article => {
          const articalRawContent = fse.readFileSync(`./contents/en/blog/${article}.md`, "utf8");
          const articalHeaders = articalRawContent.split('---')[1].split(/\r?\n/);
          
          let title = article;
          let description = article;
          for (const header of articalHeaders) {
            if(header.indexOf('title') === 0){
              title = header.split(':')[1];
            }
            if(header.indexOf('description') === 0){
              description = header.split(':')[1];
            }
          }
          
          feed.addItem({
            title,
            link: `https://blog.castnet.club/en/blog/${article}`,
            description,
          })
        })
      
        feed.addCategory('software development')
      },
      type: 'rss2', // Can be: rss2, atom1, json1
    }
  ],
  styleResources: {
    scss: [
      '@/assets/css/utilities/_variables.scss',
      '@/assets/css/utilities/_helpers.scss',
      '@/assets/css/base/_grid.scss',
      '@/assets/css/base/_buttons.scss'
    ],
  },

  webfontloader: {
    custom: {
      families: ['Graphik', 'Tiempos Headline'],
      urls: ['/fonts/fonts.css']
    }
  },

  generate: {
    routes: [
      '/he', '404'
    ]
      .concat(blogsHe.map(w => `/blog/${w}`))
      .concat(blogsEn.map(w => `en/blog/${w}`))
  }
}
