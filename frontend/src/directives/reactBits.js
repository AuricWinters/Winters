/**
 * React Bits 动效指令 — v-spotlight / v-tilt / v-magnet
 * 用法: <div v-spotlight>...</div>
 */
export const vSpotlight = {
  mounted(el) {
    el.style.position = el.style.position || 'relative'
    el.style.overflow = 'hidden'

    function onMove(e) {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      el.style.setProperty('--mx', x + '%')
      el.style.setProperty('--my', y + '%')
    }
    el._spotlightMove = onMove
    el.addEventListener('mousemove', onMove)
  },
  unmounted(el) {
    el.removeEventListener('mousemove', el._spotlightMove)
  }
}

export const vTilt = {
  mounted(el, binding) {
    const maxDeg = binding.value?.maxDeg ?? 12
    const perspective = binding.value?.perspective ?? 800
    el.style.transformStyle = 'preserve-3d'
    el.style.willChange = 'transform'

    function onMove(e) {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      el.style.transform = `perspective(${perspective}px) rotateY(${dx * maxDeg}deg) rotateX(${-dy * maxDeg}deg)`
    }
    function onLeave() {
      el.style.transform = `perspective(${perspective}px) rotateY(0deg) rotateX(0deg)`
    }
    el._tiltMove = onMove
    el._tiltLeave = onLeave
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
  },
  unmounted(el) {
    el.removeEventListener('mousemove', el._tiltMove)
    el.removeEventListener('mouseleave', el._tiltLeave)
  }
}

export const vMagnet = {
  mounted(el, binding) {
    const maxDist = binding.value?.maxDist ?? 120
    const strength = binding.value?.strength ?? 20
    el.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)'

    function onMove(e) {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < maxDist) {
        const s = (1 - dist / maxDist) * strength
        el.style.transform = `translate(${(dx / dist) * s}px, ${(dy / dist) * s}px)`
      } else {
        el.style.transform = 'translate(0, 0)'
      }
    }
    function onLeave() {
      el.style.transform = 'translate(0, 0)'
    }
    el._magnetMove = onMove
    window.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
  },
  unmounted(el) {
    window.removeEventListener('mousemove', el._magnetMove)
  }
}
