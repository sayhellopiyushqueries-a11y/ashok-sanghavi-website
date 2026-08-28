import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import Icon from '../components/Icons'
import { services } from '../lib/site'

export default function WhatWeDo() {
  return (
    <section id="services" className="relative bg-cream py-24 sm:py-32">
      <div className="container-lux">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow eyebrow--center justify-center">What we do</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
              Eight disciplines, one considered plan.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 font-sans text-[1.05rem] leading-relaxed text-ink-soft">
              Every part of your financial life connects. We bring them together with care, so nothing works
              against anything else.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 4) * 90}>
              <Link to={`/services/${s.slug}`} className="service-card group block h-full">
                <span className="mb-6 grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-ivory text-gold transition-all duration-500 group-hover:border-gold group-hover:bg-gold/10">
                  <Icon name={s.icon} size={22} />
                </span>
                <h3 className="font-display text-[1.35rem] leading-snug text-emerald">{s.title}</h3>
                <span className="service-underline" />
                <p className="mt-3 font-sans text-[0.94rem] leading-relaxed text-ink-soft">{s.blurb}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-sans text-[0.82rem] font-semibold text-emerald opacity-0 transition-all duration-500 group-hover:opacity-100">
                  Explore
                  <Icon name="arrow" size={15} className="text-gold" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
