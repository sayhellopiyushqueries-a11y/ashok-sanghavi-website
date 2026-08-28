import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import Icon from '../components/Icons'
import { firm } from '../lib/site'

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24 text-ivory sm:py-32" style={{ background: 'var(--emerald-deep)' }}>
      {/* soft radial glow + grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: 'radial-gradient(80% 120% at 50% 0%, rgba(198,162,83,0.16), transparent 60%)' }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="container-lux relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow eyebrow--center justify-center text-gold-light">Let us begin</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-6 font-display text-4xl leading-[1.12] text-ivory sm:text-5xl lg:text-[3.4rem]">
              Yes, I am interested in a no cost, no obligation consultation.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mx-auto mt-6 max-w-xl font-sans text-[1.05rem] leading-relaxed text-sage-light">
              A calm, unhurried conversation about where you are and where you want to be. No pressure, no cost,
              just clarity about your options.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/contact" className="btn-gold w-full sm:w-auto">
                Schedule a meeting
              </Link>
              <a href={firm.phoneHref} className="btn-ghost w-full border-ivory/25 text-ivory hover:border-gold hover:text-gold-light sm:w-auto">
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
