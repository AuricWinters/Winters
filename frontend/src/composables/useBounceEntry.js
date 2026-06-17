/**
 * useBounceEntry — 弹性入场动画
 * 来源: React Bits BounceCards
 * 用法: useBounceEntry('.card', { staggerMs?: 100 })
 */
export function useBounceEntry(selector, { staggerMs = 100 } = {}) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target
        el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)'
        el.style.transform = 'scale(1)'
        observer.unobserve(el)
      })
    },
    { threshold: 0.1 }
  )

  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.transform = 'scale(0)'
    setTimeout(() => observer.observe(el), i * staggerMs)
  })
}
