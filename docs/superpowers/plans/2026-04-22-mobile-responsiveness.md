# Mobile Responsiveness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix mobile layout for the hero window section (image cropping) and the services carousel (full steering wheel + active service panel below it), while leaving the desktop layout untouched.

**Architecture:** Pure CSS object-position fix for the hero; template restructure + GSAP conditional branching for the carousel. Mobile carousel uses a pinned section with scroll-driven wheel rotation and a reactive content panel (Vue Transition keyed on activeIndex) instead of the desktop's physical card-stack movement.

**Tech Stack:** Vue 3 (Composition API), GSAP + ScrollTrigger, Tailwind CSS (lg breakpoint = 1024px)

---

## Files to Modify

| File | What changes |
|---|---|
| `src/components/sections/HeroWindowSection.vue` | Add mobile-specific `object-position` Tailwind classes to window frame and scenery images |
| `src/components/sections/ServicesCarousel.vue` | Add `mobileWheelRef`; restructure template into separate mobile/desktop blocks; refactor GSAP to branch on `isMobile` |

---

### Task 1: Fix hero image cropping on mobile

**Files:**
- Modify: `src/components/sections/HeroWindowSection.vue`

- [ ] **Step 1: Update the scenery image object-position for mobile**

In `HeroWindowSection.vue`, find the scenery `<img>` tag (line ~69):

```html
<img
  :src="sceneryBg"
  alt="Paros Scenery"
  class="w-full h-full object-cover object-center"
/>
```

Change to:

```html
<img
  :src="sceneryBg"
  alt="Paros Scenery"
  class="w-full h-full object-cover object-[60%_center] lg:object-center"
/>
```

- [ ] **Step 2: Update the window frame image object-position for mobile**

Find the window frame `<img>` tag (line ~91):

```html
<img
  :src="windowFrame"
  alt="Car Window Frame"
  class="w-full h-full object-cover"
/>
```

Change to:

```html
<img
  :src="windowFrame"
  alt="Car Window Frame"
  class="w-full h-full object-cover object-top lg:object-center"
/>
```

- [ ] **Step 3: Verify in browser at mobile viewport**

Run: `npm run dev` (if not already running)

Open browser DevTools → toggle device toolbar → select iPhone 12 Pro (390×844) or similar portrait mobile viewport.

Expected:
- Car window frame fills the full screen height without awkward cropping — the top of the frame (car roof) is anchored to the top of the viewport
- Scenery is visible through the window frame, horizon roughly centered
- Scroll animation still works (window zooms in, scenery parallaxes)
- On desktop (1280px+) — no visible change

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/HeroWindowSection.vue
git commit -m "fix: mobile object-position for hero window frame and scenery images"
```

---

### Task 2: Restructure ServicesCarousel template for mobile

**Files:**
- Modify: `src/components/sections/ServicesCarousel.vue`

- [ ] **Step 1: Add `mobileWheelRef` to the script setup block**

In `ServicesCarousel.vue`, find the existing refs at the top of `<script setup>` (lines 6–10):

```js
const sectionRef = ref(null);
const wheelRef = ref(null);
const servicesContainerRef = ref(null);
const cardsWrapperRef = ref(null);
const activeIndex = ref(0);
```

Change to:

```js
const sectionRef = ref(null);
const wheelRef = ref(null);
const mobileWheelRef = ref(null);
const servicesContainerRef = ref(null);
const cardsWrapperRef = ref(null);
const activeIndex = ref(0);
```

- [ ] **Step 2: Replace the split layout container with separate mobile and desktop blocks**

Find the entire `<!-- Split Layout Container -->` div and its children (lines 185–276 in the template). Replace it with:

```html
<!-- Mobile Layout (< lg) -->
<div class="flex lg:hidden flex-col h-screen">
  <!-- Steering wheel row: top half -->
  <div class="flex items-center justify-center" style="height: 50vh;">
    <div
      ref="mobileWheelRef"
      class="w-[80vw] max-w-[400px] aspect-square"
    >
      <img
        :src="steeringWheel"
        alt="Steering Wheel"
        class="w-full h-full object-contain"
        style="filter: drop-shadow(0 25px 50px rgba(0,0,0,0.3));"
      />
    </div>
  </div>

  <!-- Active service content panel: bottom half -->
  <div class="overflow-hidden px-6 pt-4" style="height: 50vh;">
    <Transition name="service-fade" mode="out-in">
      <div :key="activeIndex" class="w-full max-w-lg mx-auto">
        <!-- Title -->
        <h3 class="font-heading text-2xl text-etp-dark mb-3">
          {{ services[activeIndex]?.title }}
        </h3>

        <!-- Description -->
        <p class="text-etp-dark/70 text-base mb-4 leading-relaxed">
          {{ services[activeIndex]?.description }}
        </p>

        <!-- Features -->
        <ul class="space-y-2 mb-5">
          <li
            v-for="feature in services[activeIndex]?.features"
            :key="feature"
            class="flex items-center text-etp-dark/60"
          >
            <svg class="w-5 h-5 text-etp-gold-dark mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            {{ feature }}
          </li>
        </ul>

        <!-- CTA -->
        <a
          :href="`/services/${services[activeIndex]?.id === 'transfers' ? 'private-transfers' : services[activeIndex]?.id === 'tours' ? 'island-tours' : services[activeIndex]?.id === 'wedding' ? 'wedding' : 'disposal-services'}`"
          class="inline-flex items-center text-etp-gold-dark hover:text-etp-dark transition-colors group"
        >
          <span class="mr-2">Learn More</span>
          <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </Transition>
  </div>
</div>

<!-- Desktop Layout (lg+) -->
<div class="hidden lg:grid grid-cols-2 h-screen">
  <!-- Left: Steering Wheel - Half visible -->
  <div class="flex items-center justify-start h-full overflow-hidden">
    <div
      ref="wheelRef"
      class="wheel-container"
    >
      <img
        :src="steeringWheel"
        alt="Steering Wheel"
        class="w-full h-full object-contain"
        style="filter: drop-shadow(0 25px 50px rgba(0,0,0,0.3));"
      />
    </div>

    <!-- Active service indicator -->
    <div class="absolute bottom-24 left-1/3 text-center whitespace-nowrap">
      <span class="text-etp-dark/60 text-lg tracking-wider uppercase font-heading transition-all duration-300">
        {{ services[activeIndex]?.title || 'Our Services' }}
      </span>
    </div>
  </div>

  <!-- Right: Services Carousel -->
  <div
    ref="servicesContainerRef"
    class="h-full overflow-hidden"
  >
    <div
      ref="cardsWrapperRef"
      class="px-4 md:px-8 lg:px-12"
    >
      <!-- Service Cards -->
      <div class="space-y-[60vh] pt-[40vh] pb-[40vh]">
        <div
          v-for="(service, index) in services"
          :key="service.id"
          class="service-card min-h-[40vh] flex items-center"
        >
          <div class="service-content w-full max-w-lg mx-auto lg:mx-0">
            <!-- Title -->
            <h3 class="font-heading text-2xl md:text-4xl text-etp-dark mb-4">
              {{ service.title }}
            </h3>

            <!-- Description -->
            <p class="text-etp-dark/70 text-lg mb-8 leading-relaxed">
              {{ service.description }}
            </p>

            <!-- Features -->
            <ul class="space-y-3 mb-8">
              <li
                v-for="feature in service.features"
                :key="feature"
                class="flex items-center text-etp-dark/60"
              >
                <svg class="w-5 h-5 text-etp-gold-dark mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                {{ feature }}
              </li>
            </ul>

            <!-- CTA -->
            <a
              :href="`/services/${service.id === 'transfers' ? 'private-transfers' : service.id === 'tours' ? 'island-tours' : service.id === 'wedding' ? 'wedding' : 'disposal-services'}`"
              class="inline-flex items-center text-etp-gold-dark hover:text-etp-dark transition-colors group"
            >
              <span class="mr-2">Learn More</span>
              <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Add service-fade transition CSS to the `<style scoped>` block**

In `ServicesCarousel.vue`, find the closing `</style>` tag and add before it:

```css
/* Mobile content panel crossfade */
.service-fade-enter-active,
.service-fade-leave-active {
  transition: opacity 0.2s ease;
}
.service-fade-enter-from,
.service-fade-leave-to {
  opacity: 0;
}
```

- [ ] **Step 4: Verify template renders without errors**

Run: `npm run dev`

Open browser at mobile viewport (390px wide). Expected:
- Mobile block visible: full steering wheel centered in top half, service content in bottom half
- No Vue console errors
- "Private Transfers" content shows by default (index 0)
- Desktop (1024px+): unchanged — left wheel half-visible, right card stack

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ServicesCarousel.vue
git commit -m "feat: add mobile layout block to ServicesCarousel with reactive content panel"
```

---

### Task 3: Refactor ServicesCarousel GSAP for mobile

**Files:**
- Modify: `src/components/sections/ServicesCarousel.vue`

- [ ] **Step 1: Replace the `onMounted` GSAP block with a mobile-aware version**

Find the entire `onMounted(() => { ... });` block (lines 41–168) and replace it with:

```js
onMounted(() => {
  setTimeout(() => {
    createContext(() => {
      const isMobile = window.innerWidth < 1024;
      const numCards = services.length; // 4

      const scrollPerCard = window.innerHeight * 1.2;
      const totalScroll = scrollPerCard * numCards;

      // Main pinned timeline (same on mobile and desktop)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: `+=${totalScroll}`,
          scrub: 0.3,
          pin: true,
          anticipatePin: 1
        }
      });

      if (isMobile) {
        // Mobile: rotate the mobile wheel only
        tl.to(mobileWheelRef.value, {
          rotation: 360,
          ease: 'none',
          duration: 1
        }, 0);
      } else {
        // Desktop: rotate desktop wheel + animate card stack
        tl.to(wheelRef.value, {
          rotation: 360,
          ease: 'none',
          duration: 1
        }, 0);

        const serviceCards = gsap.utils.toArray('.service-card');
        const viewportCenter = window.innerHeight * 0.4;

        const cardPositions = serviceCards.map((card) => {
          const rect = card.getBoundingClientRect();
          const wrapperRect = cardsWrapperRef.value.getBoundingClientRect();
          return rect.top - wrapperRect.top;
        });

        serviceCards.forEach((card, i) => {
          const content = card.querySelector('.service-content');
          const segmentStart = i / numCards;
          const segmentEnd = (i + 1) / numCards;
          const moveEnd = segmentStart + (segmentEnd - segmentStart) * 0.3;
          const lockStart = moveEnd;

          const targetY = -(cardPositions[i] - viewportCenter);

          if (i === 0) {
            gsap.set(cardsWrapperRef.value, { y: targetY });
            gsap.set(content, { opacity: 1, filter: 'blur(0px)', scale: 1 });
          } else {
            gsap.set(content, { opacity: 0.3, filter: 'blur(4px)', scale: 0.95 });
          }

          if (i > 0) {
            const prevContent = serviceCards[i - 1].querySelector('.service-content');
            tl.to(prevContent, {
              opacity: 0.3,
              filter: 'blur(4px)',
              scale: 0.95,
              duration: (moveEnd - segmentStart) * 0.5,
              ease: 'power2.in'
            }, segmentStart);

            tl.to(cardsWrapperRef.value, {
              y: targetY,
              ease: 'power2.out',
              duration: moveEnd - segmentStart
            }, segmentStart);

            tl.to(content, {
              opacity: 1,
              filter: 'blur(0px)',
              scale: 0.95,
              duration: (moveEnd - segmentStart) * 0.8,
              ease: 'power2.out'
            }, segmentStart);
          }

          tl.to(content, {
            scale: 1.02,
            duration: 0.02,
            ease: 'power2.out'
          }, lockStart);

          tl.to(content, {
            scale: 1,
            duration: 0.03,
            ease: 'elastic.out(1, 0.5)'
          }, lockStart + 0.02);
        });

        // Heading animation (desktop only — heading is above the pinned section)
        gsap.from('.services-heading', {
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          duration: 0.8
        });
      }

      // activeIndex updates — always run on both mobile and desktop
      services.forEach((_, i) => {
        const segmentStart = i / numCards;
        const segmentEnd = (i + 1) / numCards;

        ScrollTrigger.create({
          trigger: sectionRef.value,
          start: `top+=${segmentStart * totalScroll} top`,
          end: `top+=${segmentEnd * totalScroll} top`,
          onEnter: () => { activeIndex.value = i; },
          onEnterBack: () => { activeIndex.value = i; }
        });
      });

    }, sectionRef.value);
  }, 100);
});
```

- [ ] **Step 2: Verify mobile GSAP behaviour in browser**

With dev server running, open mobile viewport (390px). Scroll down into the Services section.

Expected:
- Section pins (page stops scrolling within the section)
- Steering wheel rotates as you scroll
- Service content panel crossfades: Private Transfers → Island Tours → Disposal Services → Wedding Services
- After 4 services, section unpins and normal scroll resumes

- [ ] **Step 3: Verify desktop GSAP behaviour is unchanged**

Switch to desktop viewport (1280px+). Scroll through the Services section.

Expected:
- Identical to pre-change: left half shows rotating wheel, right side cycles through cards with blur/focus animation
- Dots indicator appears on right edge
- No console errors

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ServicesCarousel.vue
git commit -m "feat: mobile GSAP branch for ServicesCarousel - pin + wheel rotation + activeIndex on mobile"
```

---

## Self-Review

**Spec coverage:**
- ✅ Hero window frame fits mobile screen — Task 1 adds `object-top` on mobile
- ✅ Scenery visible correctly on mobile — Task 1 adds `object-[60%_center]` on mobile
- ✅ Desktop hero unchanged — `lg:object-center` restores default
- ✅ Mobile carousel: steering wheel shows full — Task 2 renders `w-[80vw]` wheel in top 50vh
- ✅ Mobile carousel: highlighted service appears below wheel — Task 2 reactive content panel keyed on `activeIndex`
- ✅ Mobile carousel: scroll-driven GSAP — Task 3 adds `isMobile` branch with pin + rotation + `activeIndex` ScrollTriggers
- ✅ Desktop carousel: unchanged — Task 3 preserves all existing desktop animation code verbatim

**Placeholder scan:** No TBDs, TODOs, or vague steps found.

**Type consistency:** `mobileWheelRef` defined in Task 2 Step 1, used in Task 3 Step 1. `services[activeIndex]` pattern is consistent throughout Task 2. `activeIndex` reactive ref is unchanged from original.
