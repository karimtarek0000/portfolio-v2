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
            <div class="space-y-3">
              <div class="flex gap-3">
                <a
                  v-for="social in socialLinks"
                  :key="social.name"
                  :href="social.url"
                  :aria-label="social.name"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="relative p-3 transition-all duration-300 border group rounded-xl bg-primary-2/10 hover:bg-primary-2/20 hover:scale-110 hover:-translate-y-1 border-primary-2/10 hover:border-primary-2/30 hover:shadow-lg"
                >
                  <!-- GitHub Icon -->
                  <svg
                    v-if="social.icon === 'github'"
                    class="relative z-10 w-6 h-6 transition-transform duration-300 text-primary-2 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                    />
                  </svg>

                  <!-- LinkedIn Icon -->
                  <svg
                    v-else-if="social.icon === 'linkedin'"
                    class="relative z-10 w-6 h-6 transition-transform duration-300 text-primary-2 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    />
                  </svg>

                  <!-- WhatsApp Icon -->
                  <svg
                    v-else-if="social.icon === 'whatsapp'"
                    class="relative z-10 w-6 h-6 transition-transform duration-300 text-primary-2 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.49 3.488"
                    />
                  </svg>

                  <!-- Glow effect on hover -->
                  <div
                    class="absolute inset-0 transition-transform duration-300 scale-0 opacity-0 rounded-xl bg-primary-2/20 group-hover:scale-100 group-hover:opacity-100 blur-sm"
                  ></div>
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
