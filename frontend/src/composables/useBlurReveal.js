/**
 * useBlurReveal — 逐字模糊渐显
 * 来源: React Bits BlurText
 * 用法: useBlurReveal('.my-text', { staggerMs?: 80, blurFrom?: 8 })
 * 文本需包裹在 <span> 中（按词拆分）
 */
export function useBlurReveal(selector, { staggerMs = 80, blurFrom = 8 } = {}) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target
        const words = el.querySelectorAll('.blur-word')
        words.forEach((w, i) => {
          setTimeout(() => {
            w.style.filter = 'blur(0)'
            w.style.opacity = '1'
            w.style.transform = 'translateY(0)'
          }, i * staggerMs)
        })
        observer.unobserve(el)
      })
    },
    { threshold: 0.2 }
  )

  document.querySelectorAll(selector).forEach(el => {
    // Split text into <span class="blur-word"> elements
    const text = el.textContent.trim()
    const words = text.split(/\s+/)
    el.innerHTML = words.map(w =>
      `<span class="blur-word" style="filter:blur(${blurFrom}px);opacity:0;transform:translateY(20px);transition:all 0.6s cubic-bezier(0.16,1,0.3,1);display:inline-block;margin-right:0.3em">${w}</span>`
    ).join('')
    observer.observe(el)
  })
}
