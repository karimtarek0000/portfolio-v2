<template>
  <footer ref="footerRef" class="mt-20 layout-container">
    <div
      class="relative px-6 py-16 overflow-hidden glassmorphism sm:px-8 lg:px-12"
    >
      <!-- Decorative Background Elements -->
      <div class="absolute inset-0 opacity-5">
        <div
          class="absolute top-0 left-0 w-32 h-32 rounded-full bg-gradient-to-br from-primary-2 to-transparent blur-3xl"
        ></div>
        <div
          class="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-gradient-to-tl from-primary-2 to-transparent blur-3xl"
        ></div>
      </div>

      <!-- Main Footer Content -->
      <div class="relative z-10">
        <!-- Header Section -->
        <div
          ref="headerSectionRef"
          class="mb-16 text-center animate-line-ssr-safe"
        >
          <h2 class="mb-4 font-bold text-md graident">Let's Connect</h2>
          <p class="max-w-2xl mx-auto text-sm leading-relaxed text-primary-3">
            Ready to bring your ideas to life? Let's create something amazing
            together.
          </p>
        </div>

        <!-- Main Content Grid -->
        <div
          class="grid grid-cols-1 gap-8 mx-auto mb-16 lg:grid-cols-12 lg:gap-12 max-w-7xl"
        >
          <!-- Brand Section - Larger on desktop -->
          <div
            ref="brandSectionRef"
            class="space-y-6 lg:col-span-6 animate-line-ssr-safe"
          >
            <div class="space-y-4">
              <h3 class="text-sm font-bold graident">Karim Tarek</h3>
              <p class="max-w-md text-sm leading-relaxed text-primary-3">
                Frontend Software Engineer passionate about creating exceptional
                user experiences with modern web technologies. Always eager to
                take on new challenges and learn cutting-edge tools.
              </p>
            </div>

            <!-- Skills/Tech Stack Preview -->
            <div class="space-y-3">
              <h4
                class="text-sm font-semibold tracking-wider uppercase text-primary-2"
              >
                Tech Stack
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in techStack"
                  :key="tech"
                  class="px-3 py-1 text-xs font-medium transition-colors duration-300 border rounded-full bg-primary-2/10 text-primary-2 border-primary-2/20 hover:bg-primary-2/20"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>

          <!-- Contact & Social -->
          <div
            ref="contactSectionRef"
            class="space-y-6 lg:col-span-6 animate-line-ssr-safe"
          >
            <h4 class="mb-4 text-sm font-semibold text-primary-2">
              Get In Touch
            </h4>

            <!-- Contact Info Cards -->
            <div class="space-y-4">
              <a
                href="mailto:karim@example.com"
                class="group flex items-center gap-4 p-4 rounded-xl bg-primary-2/5 hover:bg-primary-2/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-primary-2/10"
              >
                <div
                  class="p-2 transition-colors duration-300 rounded-lg bg-primary-2/10 group-hover:bg-primary-2/20"
                >
                  <SharedRenderSVG
                    iconName="email"
                    sizes="w-5 h-5"
                    :fill="isDark ? '#9A9A9A' : '#181818'"
                  />
                </div>
                <div class="flex-1">
                  <p class="text-xs tracking-wider uppercase text-primary-3">
                    Email
                  </p>
                  <p
                    class="text-sm font-medium transition-transform duration-300 transform text-primary-2 group-hover:translate-x-1"
                  >
                    karim@example.com
                  </p>
                </div>
              </a>

              <a
                href="tel:+1234567890"
                class="group flex items-center gap-4 p-4 rounded-xl bg-primary-2/5 hover:bg-primary-2/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-primary-2/10"
              >
                <div
                  class="p-2 transition-colors duration-300 rounded-lg bg-primary-2/10 group-hover:bg-primary-2/20"
                >
                  <SharedRenderSVG
                    iconName="phone"
                    sizes="w-5 h-5"
                    :fill="isDark ? '#9A9A9A' : '#181818'"
                  />
                </div>
                <div class="flex-1">
                  <p class="text-xs tracking-wider uppercase text-primary-3">
                    Phone
                  </p>
                  <p
                    class="text-sm font-medium transition-transform duration-300 transform text-primary-2 group-hover:translate-x-1"
                  >
                    +1 (234) 567-890
                  </p>
                </div>
              </a>
            </div>

            <!-- Social Links -->
            <div class="space-y-3">
              <p class="text-xs tracking-wider uppercase text-primary-3">
                Follow Me
              </p>
              <div class="flex gap-3">
                <a
                  v-for="social in socialLinks"
                  :key="social.name"
                  :href="social.url"
                  :aria-label="social.name"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="relative p-3 transition-all duration-300 border group rounded-xl bg-primary-2/10 hover:bg-primary-2/20 hover:scale-110 hover:-translate-y-1 border-primary-2/10 hover:border-primary-2/30"
                >
                  <SharedRenderSVG
                    :iconName="social.icon"
                    sizes="w-5 h-5"
                    :fill="isDark ? 'white' : 'black'"
                    class="relative z-10"
                  />
                  <!-- Tooltip -->
                  <span
                    class="absolute px-2 py-1 text-xs transition-opacity duration-300 transform -translate-x-1/2 rounded opacity-0 pointer-events-none -top-10 left-1/2 bg-primary-2 text-primary-1 group-hover:opacity-100 whitespace-nowrap"
                  >
                    {{ social.name }}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Divider with Gradient -->
        <div class="relative mb-12">
          <div class="absolute inset-0 flex items-center">
            <div
              class="w-full border-t border-gradient-to-r from-transparent via-primary-2/20 to-transparent"
            ></div>
          </div>
          <div class="relative flex justify-center">
            <div class="px-6 bg-primary-1">
              <div class="w-2 h-2 rounded-full bg-primary-2/30"></div>
            </div>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div ref="bottomSectionRef" class="animate-line-ssr-safe">
          <div
            class="flex flex-col items-center justify-between gap-6 text-sm sm:flex-row"
          >
            <!-- Copyright -->
            <div
              class="flex flex-col items-center gap-2 sm:flex-row text-primary-3"
            >
              <p>© {{ currentYear }} Karim Tarek.</p>
              <p class="hidden sm:block">•</p>
              <p>Crafted with ❤️ using Vue.js & Tailwind CSS</p>
            </div>

            <!-- Legal Links -->
            <div class="flex items-center gap-6 text-primary-3">
              <a
                href="#"
                class="text-sm transition-colors duration-300 hover:text-primary-2"
              >
                Privacy
              </a>
              <span class="text-primary-2/30">•</span>
              <a
                href="#"
                class="text-sm transition-colors duration-300 hover:text-primary-2"
              >
                Terms
              </a>
            </div>
          </div>
        </div>

        <!-- Back to Top Button -->
        <div
          ref="backToTopRef"
          class="flex justify-center mt-12 animate-line-ssr-safe"
        >
          <SharedButton
            variant="outline"
            size="md"
            @click="scrollToTop"
            class="group hover:shadow-xl hover:shadow-primary-2/25"
          >
            <SharedRenderSVG
              iconName="arrow-up"
              sizes="w-4 h-4"
              :fill="isDark ? 'white' : 'black'"
              class="transition-transform duration-300 group-hover:-translate-y-1"
            />
            Back to Top
          </SharedButton>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const { isDark } = useToggleTheme()

// Template refs for animations
const footerRef = ref<HTMLElement | null>(null)
const headerSectionRef = ref<HTMLElement | null>(null)
const brandSectionRef = ref<HTMLElement | null>(null)
const linksSectionRef = ref<HTMLElement | null>(null)
const contactSectionRef = ref<HTMLElement | null>(null)
const bottomSectionRef = ref<HTMLElement | null>(null)
const backToTopRef = ref<HTMLElement | null>(null)

// Current year for copyright
const currentYear = new Date().getFullYear()

// Tech stack for visual appeal
const techStack = ['Vue.js', 'TypeScript', 'Tailwind CSS', 'Nuxt.js', 'GSAP']

// Navigation links
const navigationLinks = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]

// Social media links
const socialLinks = [
  {
    name: 'GitHub',
    icon: 'github',
    url: 'https://github.com/karimtarek',
  },
  {
    name: 'LinkedIn',
    icon: 'linkedin',
    url: 'https://linkedin.com/in/karimtarek',
  },
  {
    name: 'WhatsApp',
    icon: 'whatsapp',
    url: 'https://wa.me/1234567890',
  },
]

// Scroll to top functionality
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

// Enhanced footer animations
onMounted(() => {
  if (process.client) {
    const { animateOnScroll } = useAnimations()

    // Animate header first
    animateOnScroll(headerSectionRef, 'fadeUp', {
      start: 'top 85%',
      duration: 1.0,
      delay: 0,
    })

    // Then animate content sections with stagger
    animateOnScroll(brandSectionRef, 'fadeUp', {
      start: 'top 85%',
      duration: 0.8,
      delay: 0.3,
    })

    animateOnScroll(linksSectionRef, 'fadeUp', {
      start: 'top 85%',
      duration: 0.8,
      delay: 0.5,
    })

    animateOnScroll(contactSectionRef, 'fadeUp', {
      start: 'top 85%',
      duration: 0.8,
      delay: 0.7,
    })

    animateOnScroll(bottomSectionRef, 'fadeUp', {
      start: 'top 85%',
      duration: 0.6,
      delay: 0.9,
    })

    animateOnScroll(backToTopRef, 'fadeUp', {
      start: 'top 85%',
      duration: 0.6,
      delay: 1.1,
    })
  }
})
</script>

<style scoped>
/* Initial hidden states for SSR */
.animate-line-ssr-safe {
  opacity: 0;
  transform: translateY(30px);
}

/* Enhanced transitions for all interactive elements */
a,
button {
  transition-property: transform, color, background-color, box-shadow,
    border-color;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom gradient border animation */
@keyframes gradient-border {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Hover effects for contact cards */
.contact-card:hover {
  background: linear-gradient(
    135deg,
    rgba(var(--primary-2), 0.1) 0%,
    rgba(var(--primary-2), 0.05) 100%
  );
}
</style>
