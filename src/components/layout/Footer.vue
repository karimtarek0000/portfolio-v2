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
        <SharedHeader
          title="Let's Connect"
          subTitle="Ready to bring your ideas to life? Let's create something amazing together."
          :animation-options="headerAnimationOptions"
        />

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
              <h3 class="text-sm font-bold text-center lg:text-start graident">
                Karim Tarek
              </h3>
              <p class="text-sm leading-relaxed lg:max-w-md text-primary-3">
                Frontend Software Engineer passionate about creating exceptional
                user experiences with modern web technologies. Always eager to
                take on new challenges and learn cutting-edge tools.
              </p>
            </div>
          </div>

          <!-- Contact & Social -->
          <div
            ref="contactSectionRef"
            class="space-y-6 lg:col-span-6 animate-line-ssr-safe"
          >
            <h4
              class="mb-4 text-sm font-semibold text-center lg:text-start text-primary-2"
            >
              Get In Touch
            </h4>

            <!-- Contact Info Cards -->
            <div class="mx-auto space-y-4 w-fit lg:w-full">
              <a
                href="mailto:karimtarekabdelaziz@gmail.com"
                class="group flex items-center gap-4 p-4 rounded-xl bg-primary-2/5 hover:bg-primary-2/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-primary-2/10"
              >
                <div
                  class="p-3 transition-colors duration-300 rounded-xl bg-primary-2/10 group-hover:bg-primary-2/20"
                >
                  <svg
                    class="w-6 h-6 text-primary-2"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m2 7 10 6 10-6" />
                  </svg>
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
                  class="p-3 transition-colors duration-300 rounded-xl bg-primary-2/10 group-hover:bg-primary-2/20"
                >
                  <svg
                    class="w-6 h-6 text-primary-2"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                    />
                  </svg>
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
            <div class="mx-auto space-y-3 w-fit lg:w-full">
              <SharedSocialLinks />
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
          <p class="text-center">© {{ currentYear }} Karim Tarek</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
// Template refs for animations
const footerRef = ref<HTMLElement | null>(null)
const brandSectionRef = ref<HTMLElement | null>(null)
const contactSectionRef = ref<HTMLElement | null>(null)
const bottomSectionRef = ref<HTMLElement | null>(null)

// Animation configuration for SharedHeader
const headerAnimationOptions = {
  triggerStart: 'top 85%',
  duration: 1.0,
  staggerDelay: 0.2,
  ease: 'back.out(1.2)',
}

// Current year for copyright
const currentYear = new Date().getFullYear()

// Tech stack for visual appeal
const techStack = ['Vue.js', 'TypeScript', 'Tailwind CSS', 'Nuxt.js', 'GSAP']

// Initialize footer animations using the dedicated composable
useFooterAnimations(
  {
    footerRef,
    brandSectionRef,
    contactSectionRef,
    bottomSectionRef,
  },
  {
    triggerStart: 'top 60%',
    duration: 0.8,
    ease: 'power2.out',
    staggerDelay: 0.2,
  },
)
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
