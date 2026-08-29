import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { heroScenes } from '../lib/site'
import CountUp from './CountUp'

// Versioned filename busts the year-long immutable cache when the video changes.
const MP4 = '/hero/master-v4.mp4'
const POSTER = '/hero/poster.jpg'

// Autumn falling-leaves that drift over the opening poster. Each leaf's colour,
// drift, spin and timing is randomised once on mount.
const LEAF_COLORS = ['#C6A253', '#B5892F', '#A6431F', '#C77B3B', '#9C6B2A', '#7E3A1F']
function Leaf({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path
        d="M12 2C8.5 5.5 6.4 11 8 16.6c.9 3.1 2.6 4.4 4 5.4 1.4-1 3.1-2.3 4-5.4C17.6 11 15.5 5.5 12 2z"
        fill={color}
      />
      <path d="M12 5.4V20.4" stroke="rgba(0,0,0,0.2)" strokeWidth="0.7" />
    </svg>
  )
}
function FallingLeaves({ count = 16 }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 13 + Math.random() * 20,
        color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
        dx: Math.random() * 130 - 30,
        spin: (Math.random() > 0.5 ? 1 : -1) * (220 + Math.random() * 360),
        dur: 7 + Math.random() * 8,
        delay: -Math.random() * 14,
        o: 0.5 + Math.random() * 0.42,
      })),
    [count]
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {leaves.map((l) => (
        <span
          key={l.id}
          className="leaf"
          style={{
            left: `${l.left}%`,
            width: l.size,
            height: l.size,
            '--dx': `${l.dx}px`,
            '--spin': `${l.spin}deg`,
            '--o': l.o,
            animationDuration: `${l.dur}s`,
            animationDelay: `${l.delay}s`,
          }}
        >
          <Leaf color={l.color} />
        </span>
      ))}
    </div>
  )
}

// smoothstep helper
const ss = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export default function ScrollHero() {
  const wrapRef = useRef(null)
  const stageRef = useRef(null)
  const videoRef = useRef(null)
  const barRef = useRef(null)
  const barMobileRef = useRef(null)
  const heroImgRef = useRef(null)
  const hasVideoRef = useRef(false)
  const captionRefs = useRef([])
  const hintRef = useRef(null)
  const progress = useRef(0)
  const target = useRef(0)
  const [ready, setReady] = useState(false)
  const [reduce, setReduce] = useState(false)

  // Video setup. Two very different strategies:
  //   • Desktop (fine pointer): stream via native HTTP range requests and
  //     scrub by seeking on scroll. Static hosts like Vercel serve byte ranges,
  //     so seeking works instantly. A blob fallback covers hosts that refuse
  //     ranges (video would otherwise stay stuck near frame 0).
  //   • Touch (iOS/Android): seeking-on-scroll cannot repaint reliably, so we
  //     let the clip AUTOPLAY and LOOP as an ambient, muted, inline background —
  //     which plays on every mobile browser. Captions still animate on scroll.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const isTouch = window.matchMedia('(pointer: coarse)').matches

    if (isTouch) {
      // Phone/tablet: no video at all. The poster with drifting leaves IS the
      // hero here; captions still animate on scroll. Video playback and
      // scroll-scrubbing are desktop-only.
      return
    }

    // Desktop: the clip is scrubbed by seeking on scroll. On a CDN, each seek to
    // an un-buffered spot triggers a byte-range fetch (network latency) → janky
    // scrub, even though it's smooth on localhost where the file is local. Fix:
    // download the whole (light) clip ONCE as a blob and scrub it in-memory, so
    // every seek is instant. Single download — no separate streaming pass — so
    // it's not heavy. The shimmer shows until the blob is ready.
    let objectUrl
    let cancelled = false
    fetch(MP4)
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error('http'))))
      .then((b) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(b)
        v.src = objectUrl
        v.load()
      })
      .catch(() => {
        // Network/blob failure — fall back to plain streaming.
        if (!cancelled) {
          v.src = MP4
          v.load()
        }
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [])

  // Scroll → progress via ScrollTrigger; video seek + caption timing in a rAF.
  useEffect(() => {
    if (reduce) return
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const v = videoRef.current
    const wrap = wrapRef.current
    if (!v || !wrap) return

    let duration = 48
    const onMeta = () => {
      duration = v.duration || 48
      if (!isTouch) {
        try {
          v.currentTime = 0.01
        } catch {}
      }
      setReady(true)
    }
    v.addEventListener('loadedmetadata', onMeta)

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        target.current = self.progress
        if (hintRef.current) hintRef.current.style.opacity = self.progress < 0.03 ? '1' : '0'
      },
    })

    const n = heroScenes.length
    let raf = null
    let running = false
    const loop = () => {
      // ease progress toward target
      progress.current += (target.current - progress.current) * 0.12
      const p = progress.current

      // Desktop only: scrub the video by seeking (coalesced — never queue while
      // the decoder is mid-seek). On touch the clip autoplays/loops instead, so
      // we leave playback alone.
      if (!isTouch) {
        const wantTime = Math.max(0.001, Math.min(duration - 0.05, p * duration))
        if (v.readyState >= 1 && !v.seeking && Math.abs(v.currentTime - wantTime) > 0.02) {
          try {
            v.currentTime = wantTime
          } catch {}
        }
      }

      // Opening poster (+ falling leaves): held fully visible at the top, then
      // fades out as you scroll to reveal the video. Held up only until the
      // video has decoded its first frame (a one-time flag — readyState itself
      // dips during every scrub-seek and would flicker the poster back).
      if (heroImgRef.current) {
        if (isTouch) {
          // Phone: the poster + leaves stays put — there is no video to reveal.
          heroImgRef.current.style.opacity = '1'
        } else {
          if (!hasVideoRef.current && v.readyState >= 2) hasVideoRef.current = true
          heroImgRef.current.style.opacity = hasVideoRef.current ? String(1 - ss(0.004, 0.06, p)) : '1'
        }
      }

      // progress rail fill (desktop vertical + mobile horizontal)
      const clamped = Math.max(0.001, Math.min(1, p))
      if (barRef.current) barRef.current.style.transform = `scaleY(${clamped})`
      if (barMobileRef.current) barMobileRef.current.style.transform = `scaleX(${clamped})`

      // captions — each scene owns a 1/n band; fade+slide in then out
      for (let i = 0; i < n; i++) {
        const el = captionRefs.current[i]
        if (!el) continue
        const local = (p - i / n) / (1 / n) // 0..1 within this scene
        let op
        let ty
        if (local < 0) {
          op = 0
          ty = 30
        } else if (i === 0) {
          // first scene: visible from the very top, then fades out
          const outA = 1 - ss(0.66, 0.96, local)
          op = outA
          ty = -ss(0.66, 0.96, local) * 26
        } else if (i === n - 1) {
          // final CTA scene: fade in and hold
          op = ss(0.02, 0.42, local)
          ty = (1 - ss(0.02, 0.42, local)) * 30
        } else {
          const inA = ss(0.05, 0.34, local)
          const outA = 1 - ss(0.66, 0.96, local)
          op = inA * outA
          ty = (1 - inA) * 30 - ss(0.66, 0.96, local) * 26
        }
        el.style.opacity = String(op)
        el.style.transform = `translateY(${ty}px)`
        el.style.pointerEvents = op > 0.6 ? 'auto' : 'none'
      }
      // Keep animating a beat past rest so eased progress settles, then idle.
      const settled = Math.abs(target.current - progress.current) < 0.0005
      if (settled) {
        running = false
        raf = null
        return
      }
      raf = requestAnimationFrame(loop)
    }
    const kick = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }
    // Nudge the loop awake on scroll; it idles once progress settles so the
    // page can reach rest (better perf + lets synthetic input settle).
    const st2 = ScrollTrigger.create({
      trigger: wrap,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: kick,
      onRefresh: kick,
    })
    kick()

    return () => {
      v.removeEventListener('loadedmetadata', onMeta)
      st.kill()
      st2.kill()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduce])

  // ---- Reduced motion / no-video static hero ----
  if (reduce) {
    return (
      <section className="relative h-svh w-full overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #17603F 0%, #124A32 55%, #0E3A28 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(14,58,40,0.35), rgba(14,58,40,0.12) 40%, rgba(14,58,40,0.55))' }} />
        <div className="relative z-10 flex h-full items-center">
          <div className="container-lux">
            <p className="eyebrow text-gold-light">{heroScenes[0].eyebrow}</p>
            <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-ivory sm:text-5xl">
              {heroScenes[0].line}
            </h1>
            <Link to="/contact" className="btn-gold mt-8">Book a consultation</Link>
          </div>
        </div>
      </section>
    )
  }

  const scrollVh = heroScenes.length * 120

  return (
    <section id="scroll-hero" ref={wrapRef} style={{ height: `${scrollVh}vh` }} className="relative">
      <div ref={stageRef} className="sticky top-0 h-svh w-full overflow-hidden bg-emerald-deep">
        {/* Video */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: 'contrast(1.07) saturate(1.09) brightness(1.02)' }}
        />{/* src is set programmatically (blob on desktop, streamed on touch) */}

        {/* Opening poster with drifting autumn leaves — the crisp still shows at
            the very top and crossfades to the scrubbing video as you scroll */}
        <div ref={heroImgRef} className="absolute inset-0" style={{ willChange: 'opacity' }}>
          <img
            src={POSTER}
            alt="Ashok Sanghavi Financial Advisory building"
            className="absolute inset-0 h-full w-full object-cover"
            onLoad={() => setReady(true)}
          />
          <FallingLeaves count={16} />
        </div>

        {/* Premium light overlays — never a heavy dark scrim */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(14,58,40,0.58) 0%, rgba(14,58,40,0.22) 12%, rgba(14,58,40,0.02) 32%, rgba(14,58,40,0) 48%, rgba(14,58,40,0.08) 72%, rgba(14,58,40,0.52) 100%)',
          }}
        />
        {/* Left-anchored scrim: gives the caption column a clean home while the
            centre of frame (the building sign) stays bright and unobscured */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgba(14,58,40,0.62) 0%, rgba(14,58,40,0.42) 20%, rgba(14,58,40,0.12) 38%, rgba(14,58,40,0) 52%)',
          }}
        />
        {/* Gentle vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(14,58,40,0.34) 100%)' }}
        />
        {/* Film grain — a fine high-frequency texture that masks the softness /
            compression of the video and lends a premium cinematic finish */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.13] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: '220px 220px',
          }}
        />

        {/* Loading shimmer */}
        {!ready && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex items-center gap-3 rounded-full bg-ivory/10 px-5 py-2.5 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-gold-light" />
              <span className="font-sans text-[0.8rem] tracking-wide text-ivory/80">Preparing the journey</span>
            </div>
          </div>
        )}

        {/* Captions — anchored to the lower-left third so they never collide
            with the building sign that sits high-centre in the exterior scenes */}
        <div className="absolute inset-x-0 bottom-[15vh] z-20 sm:bottom-[16vh]">
          <div className="container-lux relative">
            {heroScenes.map((scene, i) => (
              <div
                key={i}
                ref={(el) => (captionRefs.current[i] = el)}
                className="absolute bottom-0 left-6 max-w-[17rem] sm:left-8 sm:max-w-[24rem] lg:max-w-[30rem]"
                style={{ opacity: 0, transform: 'translateY(30px)', willChange: 'opacity, transform' }}
              >
                <p className="eyebrow text-gold-light" style={{ textShadow: '0 2px 18px rgba(14,58,40,0.55)' }}>
                  {scene.eyebrow}
                </p>
                <h2
                  className="mt-5 font-display text-[1.7rem] leading-[1.12] text-ivory sm:text-[2.2rem] lg:text-[2.7rem]"
                  style={{ textShadow: '0 2px 30px rgba(14,58,40,0.6), 0 1px 3px rgba(14,58,40,0.5)' }}
                >
                  {scene.line}
                </h2>
                {scene.cta && (
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link to="/contact" className="btn-gold">Book a consultation</Link>
                    <a href="tel:+18668004771" className="font-sans text-ivory/80 link-gold" style={{ color: '#F5F0E6' }}>
                      or call 1-866-800-4771
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Progress rail — slim gold line that fills */}
        <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 sm:flex sm:flex-col sm:items-center">
          <span className="mb-3 font-sans text-[0.6rem] uppercase tracking-[0.3em] text-ivory/50">Journey</span>
          <div className="relative h-48 w-[2px] overflow-hidden rounded-full bg-ivory/20">
            <div
              ref={barRef}
              className="absolute inset-x-0 top-0 h-full origin-top rounded-full"
              style={{ background: 'linear-gradient(180deg, var(--gold-light), var(--gold))', transform: 'scaleY(0)' }}
            />
          </div>
        </div>

        {/* Mobile progress line — thin gold fill along the bottom edge */}
        <div className="absolute inset-x-0 bottom-0 z-20 h-[3px] bg-ivory/15 sm:hidden">
          <div
            ref={barMobileRef}
            className="h-full origin-left"
            style={{ background: 'linear-gradient(90deg, var(--gold-light), var(--gold))', transform: 'scaleX(0)' }}
          />
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500"
        >
          <span className="font-sans text-[0.62rem] uppercase tracking-[0.34em] text-ivory/60">Scroll to explore</span>
          <span className="relative h-9 w-[18px] rounded-full border border-ivory/40">
            <span className="absolute left-1/2 top-1.5 h-2 w-[3px] -translate-x-1/2 animate-bounce rounded-full bg-gold-light" />
          </span>
        </div>

        {/* Watermark safety / trust badge — frosted pill, pulsing dot, count-up */}
        <div className="absolute bottom-5 right-5 z-30 sm:bottom-6 sm:right-8">
          <div className="flex items-center gap-3 rounded-full border border-gold/40 bg-ivory/12 px-4 py-2.5 backdrop-blur-md shadow-soft">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage-light opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sage-light" />
            </span>
            <span className="font-sans text-[0.82rem] font-semibold leading-none text-ivory">
              {/* EDIT: change 30 / label below to update the badge */}
              <CountUp value={30} suffix="+" className="text-gold-light" />{' '}
              <span className="text-ivory/85">Years of Trust</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
