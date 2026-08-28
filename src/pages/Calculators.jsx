import PageTransition from '../components/PageTransition'
import Seo from '../components/Seo'
import PageHero from '../components/PageHero'
import CTASection from '../components/CTASection'
import Reveal from '../components/Reveal'
import Icon from '../components/Icons'
import { calculators } from '../lib/content'

export default function Calculators() {
  return (
    <PageTransition>
      <Seo
        title="Financial Calculators"
        description="A set of simple financial calculators for investing, retirement, mortgage and income tax planning."
      />
      <PageHero
        eyebrow="Tools"
        title="Financial calculators."
        intro="A few simple tools to help you picture the numbers. Each one opens in a new tab."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Calculators' }]}
      />

      <section className="bg-ivory py-24 sm:py-28">
        <div className="container-lux">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {calculators.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 80}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-2xl border border-gold/20 bg-cream p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-lift"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-2xl border border-gold/30 bg-ivory text-gold transition-all duration-500 group-hover:border-gold group-hover:bg-gold/10">
                    <Icon name={c.icon} size={26} />
                  </span>
                  <h2 className="mt-7 font-display text-[1.45rem] leading-snug text-emerald">{c.title}</h2>
                  <p className="mt-3 flex-1 text-body text-ink-soft">{c.blurb}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-sans text-[0.86rem] font-semibold text-emerald">
                    Open calculator
                    <Icon
                      name="arrowUpRight"
                      size={16}
                      className="text-gold transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-10 max-w-2xl text-[0.9rem] leading-relaxed text-ink-muted">
              These calculators are provided for general illustration only. They do not account for your full situation
              and are not advice. For guidance tailored to you, we would be glad to talk.
            </p>
          </Reveal>
        </div>
      </section>

      <CTASection
        eyebrow="Beyond the numbers"
        heading="A calculator is a start. The plan is the rest."
        sub="Numbers on a screen cannot see your whole picture. We can. Let us turn an estimate into a real strategy."
      />
    </PageTransition>
  )
}
