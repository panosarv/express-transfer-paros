import { onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export function useGsap() {
  const contexts = [];

  onUnmounted(() => {
    // Clean up all GSAP contexts on component unmount
    contexts.forEach(ctx => ctx.revert());
    ScrollTrigger.getAll().forEach(st => st.kill());
  });

  const createScrollTrigger = (trigger, options) => {
    return ScrollTrigger.create({
      trigger,
      ...options
    });
  };

  const createTimeline = (scrollTriggerOptions = null) => {
    const tl = gsap.timeline(
      scrollTriggerOptions ? { scrollTrigger: scrollTriggerOptions } : {}
    );
    return tl;
  };

  const createContext = (callback, scope) => {
    const ctx = gsap.context(callback, scope);
    contexts.push(ctx);
    return ctx;
  };

  // Utility to refresh ScrollTrigger after DOM changes
  const refresh = () => {
    ScrollTrigger.refresh();
  };

  // Create responsive animations
  const matchMedia = (breakpoints) => {
    return ScrollTrigger.matchMedia(breakpoints);
  };

  return {
    gsap,
    ScrollTrigger,
    createScrollTrigger,
    createTimeline,
    createContext,
    refresh,
    matchMedia
  };
}

// Export gsap and ScrollTrigger for direct use
export { gsap, ScrollTrigger };
