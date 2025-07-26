// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  srcDir: 'src/',
  devtools: { enabled: true },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      meta: [
        {
          name: 'google-site-verification',
          content: '4RO_bRh5fWXWNWU_LsETY6WTBH8BUOxYYYNxSAj6P10',
        },
        {
          name: 'description',
          content:
            'Karim Tarek - Frontend Software Engineer. Explore my portfolio showcasing web development projects, technical skills, and professional experience.',
        },
        {
          property: 'og:image',
          content: '',
        },
        {
          property: 'og:title',
          content: 'Karim Tarek - Frontend Software Engineer',
        },
        {
          property: 'og:description',
          content: 'Frontend Software Engineer | Explore my portfolio',
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:url',
          content: 'https://portfolio-v2-sigma-rust.vercel.app/',
        },
      ],
      title: 'karim tarek - Frontend Engineer',
      link: [
        { rel: 'dns-prefetch', href: 'https://drive.google.com' },
        {
          rel: 'preload',
          href: 'https://lottie.host/707ad562-0d36-49dc-bc46-b46fa8ce1896/fGbyNuf4y4.json',
          as: 'fetch',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: 'https://lottie.host/eca2fac4-6448-4276-8f61-783f40d33d66/n7MP5EFvxv.json',
          as: 'fetch',
          crossorigin: 'anonymous',
        },
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
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxtjs/google-fonts',
    'nuxt-swiper',
    'nuxt-simple-sitemap',
    'nuxt-simple-robots',
  ],
  css: ['~/assets/style/main.css'],

  site: {
    url: 'https://karim-tarek.vercel.app',
  },

  sitemap: {
    autoLastmod: true,
    urls: [{ loc: '/', changefreq: 'monthly', priority: 1.0 }],
  },

  robots: {
    groups: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://karim-tarek.vercel.app/sitemap.xml',
  },

  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/dafgi7p8c/image/fetch',
      modifiers: {
        format: 'webp',
      },
    },
  },

  googleFonts: {
    display: 'block',
    families: {
      Poppins: [400, 500, 600],
    },
    preload: true,
  },
})
