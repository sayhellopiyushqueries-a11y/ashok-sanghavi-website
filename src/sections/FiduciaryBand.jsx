import Reveal from '../components/Reveal'

export default function FiduciaryBand() {
  return (
    <section className="relative py-20 sm:py-24" style={{ background: 'var(--cream)' }}>
      <div className="container-lux">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <hr className="rule-gold mx-auto mb-10 w-24" />
          </Reveal>
          <Reveal delay={80}>
            <p className="eyebrow eyebrow--center mb-6 justify-center">The fiduciary difference</p>
          </Reveal>
          <Reveal delay={140}>
            <p className="font-display text-[1.7rem] leading-[1.35] text-emerald sm:text-[2.15rem]">
              A fiduciary is legally bound to put your interests first, at the highest standard of care.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <hr className="rule-gold mx-auto mt-10 w-24" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
