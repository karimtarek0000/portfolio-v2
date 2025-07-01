<script lang="ts" setup>
interface Service {
  id: number
  title: string
  description: string
  features: string[]
  icon: string
  duration?: string
  price?: string
}

// ============================================================================
// REACTIVE DATA
// ============================================================================

// Template refs
const sectionRef = ref<HTMLElement | null>(null)
const servicesContainerRef = ref<HTMLElement | null>(null)
const serviceCardRefs = ref<HTMLElement[]>([])

// Configuration for SharedHeader animations
const headerAnimationOptions = {
  triggerStart: 'top 75%',
  duration: 1.0,
  staggerDelay: 0.2,
  ease: 'back.out(1.2)',
}

// Services data
const services: Service[] = [
  {
    id: 1,
    title: 'Legacy Code Transformation',
    description:
      'Breathe new life into outdated codebases with modern architecture, improved performance, and maintainable code that scales with your business needs.',
    features: [
      'Code modernization & optimization',
      'Performance improvements',
      'Clean architecture implementation',
      'Component based-architecture',
      'Testing suite',
    ],
    icon: 'refactor',
  },
  {
    id: 2,
    title: 'Full-Stack Development',
    description:
      'End-to-end application development from initial concept to production deployment, utilizing cutting-edge technologies and industry best practices.',
    features: [
      'Modern frontend & backend development',
      'RESTful APIs & GraphQL integration',
      'Renders mode (CSR-SSR-SSG-ISR)',
      'Automated CI/CD pipelines',
    ],
    icon: 'development',
  },
  {
    id: 3,
    title: 'Framework Migration',
    description:
      'Seamlessly transition between Vue and React ecosystems while maintaining functionality, improving performance, and future-proofing your applications.',
    features: [
      'Vue ↔ React conversions',
      'State management migration',
      'Component architecture restructuring',
      'Performance optimization',
      'Testing migration',
    ],
    icon: 'migration',
  },
  {
    id: 4,
    title: 'Pixel-Perfect UI',
    description:
      'Transform designs into stunning, responsive interfaces that deliver exceptional user experiences across all devices and platforms.',
    features: [
      'Design system development',
      'Mobile-first responsive design',
      'Animations & interactions',
    ],
    icon: 'ui-design',
  },
]

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Set service card ref for animations
 */
const setServiceCardRef = (
  el: Element | ComponentPublicInstance | null,
  index: number,
) => {
  if (el && '$el' in el) {
    // Handle component instance
    serviceCardRefs.value[index] = el.$el as HTMLElement
  } else if (el) {
    // Handle direct element
    serviceCardRefs.value[index] = el as HTMLElement
  }
}

/**
 * Get the appropriate SVG icon for each service
 */
const getServiceIcon = (iconName: string) => {
  // Return the path to the SVG file
  return `/icons/services/${iconName}.svg`
}

// ============================================================================
// ANIMATIONS
// ============================================================================

// Initialize services animations using the dedicated composable
useServicesAnimations(
  {
    sectionRef,
    servicesContainerRef,
    serviceCardRefs,
  },
  {
    triggerStart: 'top 80%',
    duration: 0.8,
    staggerDelay: 0.15,
    ease: 'power2.out',
    cardHoverEnabled: true,
  },
)
</script>

<template>
  <section ref="sectionRef" class="py-10 mt-20 glassmorphism">
    <!-- Header with animations -->
    <SharedHeader
      title="services"
      subTitle="Transforming ideas into exceptional digital experiences with precision and innovation"
      :animation-options="headerAnimationOptions"
    />

    <!-- Services Grid -->
    <div ref="servicesContainerRef" class="max-w-6xl px-5 mx-auto mt-12">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div
          v-for="(service, index) in services"
          :key="service.id"
          :ref="el => setServiceCardRef(el, index)"
          class="service-card animate-line-ssr-safe group"
        >
          <!-- Service Icon -->
          <div class="service-card__icon-wrapper">
            <div class="service-card__icon">
              <img
                :src="getServiceIcon(service.icon)"
                :alt="`${service.title} icon`"
                class="h-[3rem] w-[3rem] text-primary-2"
                loading="lazy"
              />
            </div>
            <div class="service-card__icon-bg"></div>
          </div>

          <!-- Service Content -->
          <div class="service-card__content">
            <h3 class="service-card__title">
              {{ service.title }}
            </h3>
            <p class="service-card__description">
              {{ service.description }}
            </p>

            <!-- Features List -->
            <ul class="service-card__features">
              <li
                v-for="feature in service.features"
                :key="feature"
                class="service-card__feature"
              >
                <svg
                  class="service-card__feature-icon"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    fill="currentColor"
                  />
                </svg>
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>

          <!-- Hover Effect Overlay -->
          <div class="service-card__overlay"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Custom animations that need to stay as CSS */
@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1) rotate(180deg);
    opacity: 0.9;
  }
}

@keyframes rotate-glow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes bullet-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@keyframes overlay-shift {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.02) rotate(1deg);
  }
}

/* Service Card Styles - Fully converted to Tailwind */
.service-card {
  @apply relative p-8 rounded-2xl transition-all duration-500 cursor-pointer;
  @apply bg-white/5 dark:bg-white/5 backdrop-blur-md;
  @apply border border-white/20 dark:border-white/10;
  @apply shadow-lg shadow-black/10 dark:shadow-black/30;
  @apply hover:bg-white/10 dark:hover:bg-white/10;
  @apply hover:border-white/30 dark:hover:border-white/20;
  @apply hover:shadow-xl hover:shadow-black/20 dark:hover:shadow-black/40;

  /* Complex gradients that need CSS variables */
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}

.service-card::before {
  @apply content-[''] absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 ease-out p-px;
  background: linear-gradient(
    135deg,
    rgba(var(--primary-2), 0.3),
    transparent,
    rgba(var(--primary-2), 0.3)
  );
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: xor;
}

.service-card:hover::before {
  @apply opacity-100;
}

.service-card__icon-wrapper {
  @apply relative mb-6 flex justify-center transition-all duration-300;
  filter: drop-shadow(0 0 20px rgba(var(--primary-2), 0.1));
}

.service-card:hover .service-card__icon-wrapper {
  filter: drop-shadow(0 0 40px rgba(var(--primary-2), 0.3));
}

.service-card__icon {
  @apply relative z-10 p-4 rounded-2xl transition-all duration-300;
  @apply bg-gradient-to-br from-primary-2/10 to-primary-2/5;
  @apply border border-primary-2/20;

  /* 3D properties that need regular CSS */
  transform-style: preserve-3d;
  perspective: 1000px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1), 0 4px 20px rgba(var(--primary-2), 0.1);
}

.service-card:hover .service-card__icon {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1), 0 8px 40px rgba(var(--primary-2), 0.25);
}

.service-card__icon-bg {
  @apply absolute inset-0 rounded-2xl opacity-0 transition-all duration-500 blur-[15px];

  /* Complex gradients with CSS variables */
  background: radial-gradient(
      circle at center,
      rgba(var(--primary-2), 0.4) 0%,
      rgba(var(--primary-2), 0.2) 30%,
      transparent 70%
    ),
    conic-gradient(
      from 0deg,
      rgba(var(--primary-2), 0.3),
      rgba(var(--primary-2), 0.1),
      rgba(var(--primary-2), 0.3)
    );
  background-size: 100% 100%, 200% 200%;
  animation: pulse-glow 3s ease-in-out infinite;
}

.service-card:hover .service-card__icon-bg {
  animation: pulse-glow 2s ease-in-out infinite, rotate-glow 8s linear infinite;
}

.service-card__content {
  @apply space-y-4;
  /* Text shadow not available in Tailwind */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.service-card__title {
  @apply text-md font-bold text-primary-2 mb-3 transition-all duration-300 relative;

  /* Gradient text with CSS variables */
  background: linear-gradient(
    135deg,
    rgba(var(--primary-2), 1) 0%,
    rgba(var(--primary-2), 0.8) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
}

.service-card:hover .service-card__title {
  background: linear-gradient(
    135deg,
    rgba(var(--primary-2), 1) 0%,
    rgba(var(--primary-2), 0.9) 50%,
    rgba(var(--primary-2), 1) 100%
  );
  background-size: 200% 200%;
  animation: shimmer 2s ease-in-out infinite;
}

.service-card__description {
  @apply text-sm leading-relaxed text-primary-3 mb-4 transition-all duration-300;
}

.service-card:hover .service-card__description {
  @apply text-primary-2/90;
  text-shadow: 0 1px 4px rgba(var(--primary-2), 0.1);
}

.service-card__features {
  @apply space-y-2 mb-6;
}

.service-card__feature {
  @apply flex items-center gap-3 text-sm text-primary-3 transition-all duration-300;
}

.service-card:hover .service-card__feature {
  @apply text-primary-2/80 translate-x-0.5;
}

.service-card__feature-icon {
  @apply inline-block w-4 h-4 text-primary-2/60 shrink-0 transition-all duration-300;
}

.service-card:hover .service-card__feature-icon {
  @apply text-primary-2;
  animation: bullet-pulse 1.5s ease-in-out infinite;
}

.service-card__overlay {
  @apply absolute inset-0 rounded-2xl opacity-0 transition-all duration-500 pointer-events-none;

  /* Complex multi-gradient backgrounds */
  background: radial-gradient(
      circle at 30% 30%,
      rgba(var(--primary-2), 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 70% 70%,
      rgba(var(--primary-2), 0.08) 0%,
      transparent 50%
    ),
    linear-gradient(
      135deg,
      rgba(var(--primary-2), 0.05) 0%,
      transparent 50%,
      rgba(var(--primary-2), 0.05) 100%
    );
}

.service-card:hover .service-card__overlay {
  @apply opacity-100;
  animation: overlay-shift 4s ease-in-out infinite;
}

/* SSR-safe animation states */
.animate-line-ssr-safe {
  @apply opacity-0 will-change-transform;
  transform: translateY(50px) scale(0.95);
}

/* Media queries with Tailwind responsive utilities */
@media print {
  .animate-line-ssr-safe {
    @apply !opacity-100;
    transform: none !important;
  }

  .service-card {
    animation: none !important;
  }

  .service-card__icon-bg {
    animation: none !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .service-card {
    @apply hover:scale-100 hover:translate-y-0;
    animation: none;
  }

  .service-card__icon {
    @apply group-hover:scale-100 group-hover:rotate-0;
  }

  .service-card__icon-bg {
    @apply group-hover:scale-100;
    animation: none;
  }

  .animate-line-ssr-safe {
    @apply opacity-0;
    transform: none;
  }

  .service-card__title {
    animation: none;
  }

  .service-card__feature-bullet {
    animation: none;
  }

  .service-card__overlay {
    animation: none;
  }
}

@media (min-width: 1024px) {
  .service-card:hover {
    @apply shadow-2xl;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 50px rgba(var(--primary-2), 0.15);
  }

  .service-card__icon {
    @apply transition-all duration-300;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
}
</style>
