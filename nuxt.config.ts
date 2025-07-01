// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  srcDir: 'src/',
  devtools: { enabled: true },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      title: 'karim tarek',

      link: [
        { rel: 'icon', href: '/favicons/favicon.ico', sizes: '48x48' },
        {
          rel: 'icon',
          href: '/favicons/favicon.svg',
          sizes: 'any',
          type: 'image/svg+xml',
        },
        {
          rel: 'icon',
          href: '/favicons/favicon.svg',
          sizes: '96x96',
          type: 'image/svg+xml',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/favicons/apple-touch-icon.png',
        },
        { rel: 'manifest', href: '/favicons/site.webmanifest' },
      ],
    },
  },
  routeRules: {
    '/': { prerender: true },
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', 'nuxt-swiper'],
  css: ['~/assets/style/main.css'],

  googleFonts: {
    display: 'block',
    families: {
      Poppins: [400, 500, 600],
    },
    preload: true,
  },
})
