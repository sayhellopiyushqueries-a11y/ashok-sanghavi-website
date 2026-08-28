import { useParams, Navigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import Seo from '../components/Seo'
import PageHero from '../components/PageHero'
import CTASection from '../components/CTASection'
import Reveal from '../components/Reveal'
import Icon from '../components/Icons'
import { watchLearnSections, concepts } from '../lib/content'

export default function WatchLearnSection() {
  const { slug } = useParams()
  const section = watchLearnSections.find((s) => s.slug === slug)
  if (!section) return <Navigate to="/watch-and-learn" replace />
  const items = concepts.filter((c) => c.group === section.group)

  return (
    <PageTransition>
      <Seo title={section.title} description={section.intro} />
      <PageHero
        eyebrow="Watch and learn"
        title={section.title}
        intro={section.intro}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Watch and Learn', to: '/watch-and-learn' },
          { label: section.title },
        ]}
      />

      <section className="bg-ivory py-24 sm:py-28">
        <div className="container-lux">
          <Reveal>
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-xl text-body text-ink-soft">
                Each concept is explained in a short video in our resource library. Select any card to watch.
              </p>
              <a href={section.resourceUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                Visit the full library
                <Icon name="arrowUpRight" size={18} />
              </a>
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 80}>
                <a
                  href={section.resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold/20 bg-cream transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
                >
                  {/* Video thumbnail slot — attach the real video here later */}
                  <div className="relative aspect-video overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(150deg, #16624380, #0E3A28)' }}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.06]"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                      }}
                    />
                    <span className="absolute left-4 top-4 text-gold-light">
                      <Icon name={c.icon} size={22} />
                    </span>
                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 font-sans text-[0.62rem] uppercase tracking-[0.24em] text-ivory/75">
                      Watch on our library
                      <Icon name="arrowUpRight" size={13} className="text-gold-light" />
                    </span>
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid h-14 w-14 place-items-center rounded-full border border-ivory/40 bg-ivory/10 text-ivory backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-gold group-hover:text-gold-light">
                        <Icon name="play" size={22} />
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-[1.2rem] leading-snug text-emerald">{c.title}</h3>
                    <p className="mt-3 text-[0.96rem] leading-relaxed text-ink-soft">{c.teaser}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Curious about one of these?"
        heading="Let us show you how it applies to you."
        sub="These ideas come to life when they are matched to your situation. A short conversation is the best place to start."
      />
    </PageTransition>
  )
}
