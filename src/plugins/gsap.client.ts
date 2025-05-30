import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
  // Register GSAP plugins only on client side
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger)

    // Set GSAP defaults for performance
    gsap.defaults({
      ease: 'power2.out',
      duration: 1,
    })

    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
      markers: false, // Set to true for debugging
    })
  }

  return {
    provide: {
      gsap,
      ScrollTrigger,
    },
  }
})
