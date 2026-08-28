import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import Icon from './Icons'
import { firm } from '../lib/site'

// Standard deep-emerald CTA band that closes every inner page.
export default function CTASection({
  eyebrow = 'Let us begin',
  heading = 'A no cost, no obligation conversation about your future.',
  sub = 'A calm, unhurried conversation about where you are and where you want to be. No pressure, no cost, just clarity.',
}) {
  return (
    <section className="relative overflow-hidden py-24 text-ivory sm:py-28" style={{ background: 'var(--emerald-deep)' }}>
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: 'radial-gradient(80% 120% at 50% 0%, rgba(198,162,83,0.16), transparent 60%)' }}
      />
      <div className="container-lux relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow eyebrow--center justify-center text-gold-light">{eyebrow}</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-6 font-display text-[2.2rem] leading-[1.14] text-ivory sm:text-[2.9rem]">{heading}</h2>
          </Reveal>
          {sub && (
            <Reveal delay={150}>
              <p className="mx-auto mt-6 max-w-xl text-body text-sage-light">{sub}</p>
            </Reveal>
          )}
          <Reveal delay={220}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
