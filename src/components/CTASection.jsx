import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import Icon from './Icons'
import Velaris from './Velaris'
import { firm } from '../lib/site'

// Living-gradient palette, tuned to the brand: emerald base, a luminous
// emerald bloom, a hint of gold, and deep shadow. Lighter than a flat panel.
const CTA_BG = '#0E3A28'
const CTA_COLORS = ['#14563B', '#2F7E58', '#B98D3E', '#0A3020']

// A small engraved fleuron divider — a classical touch.
function Fleuron({ className = '' }) {
  return (
    <svg width="164" height="16" viewBox="0 0 164 16" className={`mx-auto text-gold-light ${className}`} fill="none" aria-hidden="true">
      <line x1="20" y1="8" x2="66" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <circle cx="72" cy="8" r="1.5" fill="currentColor" />
      <path d="M82 1.5 l6 6.5 -6 6.5 -6 -6.5 z" fill="currentColor" />
      <circle cx="92" cy="8" r="1.5" fill="currentColor" />
      <line x1="98" y1="8" x2="144" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.55" />
    </svg>
  )
}

// Standard deep-emerald CTA band that closes every page. Classical + premium:
// a double gold hairline frame, an engraved fleuron, and refined type.
export default function CTASection({
  eyebrow = 'Let us begin',
  heading = 'A no cost, no obligation conversation about your future.',
  sub = 'A calm, unhurried conversation about where you are and where you want to be. No pressure, no cost, just clarity.',
}) {
  return (
    <section className="relative overflow-hidden py-16 text-ivory sm:py-24" style={{ background: CTA_BG }}>
      {/* living-gradient WebGL background */}
      <div className="absolute inset-0">
        <Velaris height="100%" bg={CTA_BG} colors={CTA_COLORS} speed={1.1} grain={0.25} />
      </div>
      {/* readability scrim over the moving gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(120% 90% at 50% 55%, rgba(10,42,27,0.15), rgba(10,42,27,0.5) 100%)' }}
      />
      {/* classical double hairline frame */}
      <div className="pointer-events-none absolute inset-x-4 inset-y-5 rounded-[1.5rem] border border-gold/25 sm:inset-x-10 sm:inset-y-8" />
      <div className="pointer-events-none absolute inset-x-[1.35rem] inset-y-[1.6rem] rounded-[1.3rem] border border-gold/12 sm:inset-x-[2.85rem] sm:inset-y-[2.35rem]" />

      <div className="container-lux relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Fleuron />
          </Reveal>
          <Reveal delay={70}>
            <p className="eyebrow eyebrow--center mt-7 justify-center text-gold-light">{eyebrow}</p>
          </Reveal>
          <Reveal delay={130}>
            <h2 className="mt-6 font-display text-[2.3rem] leading-[1.12] text-ivory sm:text-[3rem]">{heading}</h2>
          </Reveal>
          {sub && (
            <Reveal delay={190}>
              <p className="mx-auto mt-6 max-w-xl text-body text-sage-light">{sub}</p>
            </Reveal>
          )}
          <Reveal delay={250}>
            <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/contact" className="btn-gold w-full sm:w-auto">
                Schedule a meeting
              </Link>
              <a
                href={firm.phoneHref}
                className="btn-ghost w-full border-ivory/25 text-ivory hover:border-gold hover:text-gold-light sm:w-auto"
              >
                <Icon name="phone" size={18} />
                Call {firm.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
