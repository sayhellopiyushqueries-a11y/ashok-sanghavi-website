import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import Icon from './Icons'
import { firm } from '../lib/site'

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
    <section className="relative overflow-hidden py-28 text-ivory sm:py-36" style={{ background: 'var(--emerald-deep)' }}>
      {/* layered gold glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{ background: 'radial-gradient(65% 100% at 50% 0%, rgba(198,162,83,0.18), transparent 62%)' }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: 'radial-gradient(55% 90% at 50% 100%, rgba(198,162,83,0.1), transparent 60%)' }}
      />
      {/* faint film grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* classical double hairline frame */}
      <div className="pointer-events-none absolute inset-x-4 inset-y-5 rounded-[1.5rem] border border-gold/25 sm:inset-x-10 sm:inset-y-8" />
      <div className="pointer-events-none absolute inset-x-[1.35rem] inset-y-[1.6rem] rounded-[1.3rem] border border-gold/12 sm:inset-x-[2.85rem] sm:inset-y-[2.35rem]" />

      <div className="container-lux relative">
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
