import { useEffect, useRef } from 'react'

// Lightweight scroll reveal: rise + fade + de-blur via the `.reveal` class,
// triggered by IntersectionObserver. `delay` staggers siblings, `variant`
// picks a flavour ('up' default, 'left', 'right', 'scale', 'fade').
export default function Reveal({ children, className = '', delay = 0, variant = 'up', as: Tag = 'div', ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-in')
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const variantClass = variant && variant !== 'up' ? `reveal--${variant}` : ''

  return (
    <Tag ref={ref} className={`reveal ${variantClass} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}
