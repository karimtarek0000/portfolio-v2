export default defineNuxtPlugin(async () => {
  if (import.meta.client) {
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')

    gsap.registerPlugin(ScrollTrigger)

    gsap.defaults({
      ease: 'power2.out',
      duration: 1,
    })

    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
      markers: false,
    })

    return {
      provide: {
        gsap,
        ScrollTrigger,
      },
    }
  }
})
