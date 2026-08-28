import Reveal from './Reveal'
import Breadcrumb from './Breadcrumb'
import ImageSlot from './ImageSlot'
import Icon from './Icons'

const facts = [
  { icon: 'clock', label: 'Established', value: '1988' },
  { icon: 'pin', label: 'Location', value: 'Elkhart, Indiana' },
  { icon: 'award', label: 'Credentials', value: 'CFP · ChFC · CLU' },
  { icon: 'scale', label: 'Standard', value: 'Fiduciary' },
]

// Premium "at a glance" emblem that fills the right side when there is no image.
function GlanceCard() {
  return (
    <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto">
      <div className="pointer-events-none absolute -inset-3 rounded-[1.7rem] border border-gold/30" />
      <div className="relative overflow-hidden rounded-[1.4rem] border border-gold/25 bg-ivory/70 p-8 shadow-soft backdrop-blur-sm">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-40 blur-2xl"
          style={{ background: 'radial-gradient(circle, rgba(198,162,83,0.3), transparent 70%)' }}
        />
        <div className="relative flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/50 text-gold">
            <span className="font-display text-lg text-emerald">AS</span>
          </span>
          <span className="font-sans text-[0.66rem] uppercase tracking-[0.28em] text-gold-deep">At a glance</span>
        </div>
        <ul className="relative mt-7 space-y-4">
          {facts.map((f) => (
            <li key={f.label} className="flex items-center gap-4 border-b border-gold/15 pb-4 last:border-0 last:pb-0">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gold/25 text-gold">
                <Icon name={f.icon} size={17} />
              </span>
              <span className="flex-1">
                <span className="block font-sans text-[0.7rem] uppercase tracking-[0.18em] text-ink-muted">{f.label}</span>
                <span className="block font-display text-[1.15rem] leading-tight text-emerald">{f.value}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Compact premium inner-page hero. Light by design, never a heavy dark banner.
// variant: 'gradient' (soft cream to sage) or provide `image` for a split hero.
export default function PageHero({
  eyebrow,
  title,
  intro,
  crumbs = [],
  image,
  imageLabel = 'Client image',
  imageIcon = 'people',
}) {
  const hasImage = image !== undefined

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, #FBF8F1 0%, #F5F0E6 55%, #E8EFE7 100%)' }}
      />
      <div
        className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full opacity-50 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(107,169,138,0.35), transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(198,162,83,0.22), transparent 70%)' }}
      />

      <div className="container-lux relative pt-32 pb-16 sm:pt-40 sm:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            {crumbs.length > 0 && (
              <Reveal>
                <div className="mb-8">
                  <Breadcrumb items={crumbs} />
                </div>
              </Reveal>
            )}
            {eyebrow && (
              <Reveal delay={60}>
                <p className="eyebrow">{eyebrow}</p>
              </Reveal>
            )}
            <Reveal delay={120}>
              <h1 className="mt-5 font-display text-[2.6rem] leading-[1.06] sm:text-[3.4rem] lg:text-[3.9rem]">
                {title}
              </h1>
            </Reveal>
            {intro && (
              <Reveal delay={200}>
                <p className="mt-6 max-w-xl text-lead text-ink-soft">{intro}</p>
              </Reveal>
            )}
          </div>

          <Reveal delay={160}>
            {hasImage ? (
              <ImageSlot
                src={image}
                alt={typeof title === 'string' ? title : ''}
                label={imageLabel}
                icon={imageIcon}
                ratio="5 / 4"
                framed
                parallax
              />
            ) : (
              <GlanceCard />
            )}
          </Reveal>
        </div>
      </div>

      <div className="rule-gold absolute inset-x-0 bottom-0 h-px opacity-70" />
    </section>
  )
}
