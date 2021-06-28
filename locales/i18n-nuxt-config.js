const I18N = {
  detectBrowserLanguage: false,
  locales: [
    {
      code: 'he',
      iso: 'he-IL',
      name: 'עברית',
      file: 'he/index.js'
    },
    {
      code: 'en',
      iso: 'en-US',
      name: 'English',
      file: 'en/index.js'
    }
  ],
  lazy: true,
  seo: false,
  langDir: 'locales/',
  defaultLocale: 'he',
  parsePages: false
}

module.exports = {
  I18N
}
