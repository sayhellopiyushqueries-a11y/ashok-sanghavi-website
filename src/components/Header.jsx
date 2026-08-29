import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { nav, services, firm } from '../lib/site'
import Icon from './Icons'

function Wordmark({ compact, light }) {
  return (
    <Link to="/" className="flex items-center gap-3 group" aria-label={`${firm.name} home`}>
      {/* Logo slot — replace /logo.svg to brand */}
      <span
        className="relative grid place-items-center overflow-hidden rounded-full border transition-all duration-500"
        style={{
          width: compact ? 38 : 44,
          height: compact ? 38 : 44,
          borderColor: light ? 'rgba(217,190,126,0.6)' : 'rgba(198,162,83,0.5)',
          background: light ? 'rgba(251,248,241,0.06)' : 'transparent',
        }}
      >
        {/* Logo slot — drop /public/logo.svg (or .png) and it appears here */}
        <img
          src="/logo.svg"
          alt=""
          className="h-full w-full object-contain p-1.5"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextElementSibling.style.display = 'block'
          }}
        />
        <span
          className="font-display text-lg leading-none"
          style={{ display: 'none', color: light ? 'var(--gold-light)' : 'var(--emerald)' }}
        >
          AS
        </span>
      </span>
      <span className="leading-tight">
        <span
          className="block font-display text-[1.05rem] sm:text-[1.15rem] tracking-tight transition-colors duration-500"
          style={{ color: light ? '#FBF8F1' : 'var(--emerald)' }}
        >
          Ashok Sanghavi
        </span>
        <span
          className="block font-sans text-[0.62rem] uppercase tracking-[0.34em] transition-colors duration-500"
          style={{ color: light ? 'rgba(207,225,213,0.85)' : 'var(--ink-muted, #6E7B72)' }}
        >
          Financial Advisory
        </span>
      </span>
    </Link>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [open, setOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      // On home, the hero is pinned for its full (tall) height; only flip the
      // header to its solid/dark treatment once real content scrolls in.
      const hero = document.getElementById('scroll-hero')
      if (hero) {
        setPastHero(y > hero.offsetHeight - window.innerHeight * 1.05)
      } else {
        setPastHero(true)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [location.pathname])

  useEffect(() => {
    setOpen(false)
    setOpenMenu(null)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => (document.body.style.overflow = '')
  }, [open])

  // Light treatment while sitting transparent over the dark home hero.
  const solid = !isHome || pastHero
  const light = !solid
  const compact = scrolled && solid

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${light ? 'header-light' : ''}`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
          background: solid ? 'rgba(251,248,241,0.82)' : 'transparent',
          backdropFilter: solid ? 'blur(14px) saturate(1.1)' : 'none',
          boxShadow: solid ? '0 10px 40px -24px rgba(14,58,40,0.4)' : 'none',
          borderBottom: solid ? '1px solid rgba(198,162,83,0.18)' : '1px solid transparent',
        }}
      >
        {/* Utility bar — a slim premium top row that collapses on scroll */}
        <div
          className="hidden overflow-hidden border-b transition-all duration-500 lg:block"
          style={{
            height: compact ? 0 : 38,
            opacity: compact ? 0 : 1,
            borderColor: light ? 'rgba(251,248,241,0.14)' : 'rgba(198,162,83,0.16)',
          }}
        >
          <div
            className="container-wide flex h-[38px] items-center justify-between font-sans text-[0.74rem] tracking-wide"
            style={{ color: light ? 'rgba(207,225,213,0.9)' : 'var(--ink-muted, #6E7B72)' }}
          >
            <span className="inline-flex items-center gap-2 uppercase tracking-[0.2em]">
              <span className="text-gold-light">&#9670;</span>
              Fiduciary advisory · Elkhart, Indiana · Since 1988
            </span>
            <div className="flex items-center gap-6">
              <a href={firm.phoneHref} className="inline-flex items-center gap-2 transition-colors hover:text-gold-light">
                <Icon name="phone" size={14} className="text-gold-light" />
                {firm.phone}
              </a>
              <a href={`mailto:${firm.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-gold-light">
                <Icon name="mail" size={14} className="text-gold-light" />
                {firm.email}
              </a>
            </div>
          </div>
        </div>

        <div
          className="container-wide flex items-center justify-between transition-all duration-500"
          style={{ height: compact ? 68 : 88 }}
        >
          <Wordmark compact={compact} light={light} />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {nav.map((item) =>
              item.children ? (
                <div
                  key={item.to}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(item.to)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-item font-sans text-[0.86rem] font-medium tracking-[0.02em] inline-flex items-center gap-1.5 ${
                        isActive
                          ? light ? 'text-gold-light' : 'text-emerald'
                          : light ? 'text-ivory/85 hover:text-ivory' : 'text-ink-soft hover:text-emerald'
                      }`
                    }
                  >
                    {item.label}
                    <svg
                      width="10" height="10" viewBox="0 0 12 12"
                      className="mt-0.5 opacity-60 transition-transform duration-300"
                      style={{ transform: openMenu === item.to ? 'rotate(180deg)' : 'none' }}
                    >
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                    </svg>
                  </NavLink>
                  <AnimatePresence>
                    {openMenu === item.to && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className={`absolute top-full pt-4 ${item.to === '/services' ? 'left-1/2 -translate-x-1/2' : 'left-0'}`}
                      >
                        {item.to === '/services' ? (
                          <div className="w-[42rem] rounded-2xl border border-gold/25 bg-ivory p-3 shadow-lift" style={{ boxShadow: '0 30px 70px -28px rgba(14,58,40,0.5)' }}>
                            <div className="mb-1 flex items-center justify-between px-3 pt-2">
                              <span className="eyebrow">What we do</span>
                              <Link to="/services" className="font-sans text-[0.76rem] font-semibold text-emerald hover:text-gold-deep">
                                View all
                              </Link>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              {services.map((s) => (
                                <Link
                                  key={s.slug}
                                  to={`/services/${s.slug}`}
                                  className="group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors duration-300 hover:bg-cream"
                                >
                                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gold/25 text-gold transition-all duration-300 group-hover:border-gold group-hover:bg-gold/10">
                                    <Icon name={s.icon} size={17} />
                                  </span>
                                  <span>
                                    <span className="block font-sans text-[0.86rem] font-semibold text-emerald">{s.title}</span>
                                    <span className="mt-0.5 block font-sans text-[0.76rem] leading-snug text-ink-muted">{s.blurb}</span>
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="w-72 rounded-2xl border border-gold/25 bg-ivory p-2 shadow-lift" style={{ boxShadow: '0 30px 70px -28px rgba(14,58,40,0.5)' }}>
                            {item.children.map((c) => (
                              <Link
                                key={c.to}
                                to={c.to}
                                className="group flex items-center justify-between rounded-xl px-4 py-3 transition-colors duration-300 hover:bg-cream"
                              >
                                <span className="font-sans text-[0.88rem] font-semibold text-emerald">{c.label}</span>
                                <Icon name="arrow" size={15} className="-translate-x-1 text-gold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                              </Link>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `nav-item font-sans text-[0.86rem] font-medium tracking-[0.02em] ${
                      isActive
                        ? light ? 'text-gold-light' : 'text-emerald'
                        : light ? 'text-ivory/85 hover:text-ivory' : 'text-ink-soft hover:text-emerald'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <span
              className="h-7 w-px"
              style={{ background: light ? 'rgba(217,190,126,0.4)' : 'rgba(198,162,83,0.35)' }}
            />
            <Link to="/contact" className="btn-primary text-[0.9rem]">
              Book a consultation
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className={`grid h-12 w-12 place-items-center rounded-full border transition-all duration-500 lg:hidden ${
              light
                ? 'border-gold-light/50 text-ivory hover:bg-ivory/10'
                : 'border-gold/45 text-emerald hover:border-gold hover:bg-gold/10'
            }`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span className="relative block h-[14px] w-[22px]">
              <span
                className="absolute left-0 top-[1px] h-[1.6px] w-full rounded-full bg-current transition-all duration-[450ms]"
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                  transformOrigin: 'center',
                  transform: open ? 'translateY(6px) rotate(45deg)' : 'none',
                }}
              />
              <span
                className="absolute left-0 top-1/2 h-[1.6px] w-full -translate-y-1/2 rounded-full bg-current transition-all duration-300"
                style={{ opacity: open ? 0 : 1, transform: open ? 'translateX(8px)' : 'translateX(0)' }}
              />
              <span
                className="absolute bottom-[1px] left-0 h-[1.6px] w-full rounded-full bg-current transition-all duration-[450ms]"
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                  transformOrigin: 'center',
                  transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none',
                }}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile full-screen slide-in menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col overflow-y-auto bg-ivory px-7 pt-28 pb-12"
            >
              <nav className="flex flex-col gap-1">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={item.to}
                      className="block border-b border-gold/15 py-4 font-display text-2xl text-emerald"
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className="grid grid-cols-1 gap-0.5 pb-3 pt-2">
                        {item.children.map((c) => (
                          <Link
                            key={c.to}
                            to={c.to}
                            className="py-1.5 pl-1 font-sans text-[0.92rem] text-ink-soft"
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </nav>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8"
              >
                <Link to="/contact" className="btn-primary w-full">
                  Book a consultation
                </Link>
                <a href={firm.phoneHref} className="mt-4 flex items-center gap-2 font-sans text-ink-soft">
                  <Icon name="phone" size={18} className="text-gold" /> {firm.phone}
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
