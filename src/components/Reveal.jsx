import { useEffect, useRef, useState } from 'react'

// Start already-visible when animation is unwanted or unsupported. Evaluated in
// the useState initializer rather than an effect, so there is no second render
// and no setState-in-effect cascade.
const startVisible = () => {
  if (typeof window === 'undefined') return true
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return true
  return typeof IntersectionObserver === 'undefined'
}

/**
 * Fades and lifts its children into place the first time they enter the
 * viewport. Reveals once and then stops observing — content never animates out,
 * so scrolling back up doesn't re-trigger it.
 *
 * Starts already-visible when the user has asked for reduced motion, or when
 * IntersectionObserver is unavailable, so content is never trapped at opacity 0.
 */
export function Reveal({ children, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(startVisible)

  useEffect(() => {
    if (shown) return undefined

    const element = ref.current
    if (!element) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [shown])

  return (
    <Tag
      ref={ref}
      className={`${className} transition-[opacity,transform] duration-[350ms] ease-out motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
      }`}
    >
      {children}
    </Tag>
  )
}
