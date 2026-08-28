import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Singleton Lenis instance shared across the app.
export let lenis = null

export function getLenis() {
  return lenis
}

// Mount once near the app root. Wires Lenis inertia scrolling into the GSAP
// ticker and keeps ScrollTrigger in sync so pinned scrubbing stays smooth.
export function useSmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    lenis = new Lenis({
      duration: 1.1,
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenis.on('scroll', ScrollTrigger.update)
    if (import.meta.env.DEV) window.__lenis = lenis

    const onTick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    // Let ScrollTrigger measure once fonts/layout settle.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = setTimeout(refresh, 600)

    return () => {
      gsap.ticker.remove(onTick)
      window.removeEventListener('load', refresh)
      clearTimeout(t)
      lenis.destroy()
      lenis = null
    }
  }, [])
}
