/**
 * useClickSpark — 点击粒子爆发
 * 来源: React Bits ClickSpark
 * 用法: useClickSpark() → 全局挂载 Canvas，点击任意处爆发彩色粒子
 */
let canvas = null
let ctx = null
let sparks = []
let animId = null

class Spark {
  constructor(x, y) {
    const angle = Math.random() * Math.PI * 2
    const speed = 2 + Math.random() * 6
    this.x = x; this.y = y
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed
    this.life = 0.6 + Math.random() * 0.6
    this.maxLife = this.life
    this.size = 1 + Math.random() * 4
    const colors = ['#a78bfa', '#60a5fa', '#f472b6', '#34d399', '#fbbf24', '#fff']
    this.color = colors[Math.floor(Math.random() * colors.length)]
  }
  update(dt) {
    this.x += this.vx * dt * 60
    this.y += this.vy * dt * 60
    this.vy += 0.5 * dt * 60
    this.life -= dt
  }
  draw(ctx) {
    const a = this.life / this.maxLife
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * a, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.globalAlpha = a
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function onClick(e) {
  for (let i = 0; i < 12; i++) sparks.push(new Spark(e.clientX, e.clientY))
}

function animate(ts) {
  const dt = Math.min(0.05, (ts - (animate.lastTs || ts)) / 1000)
  animate.lastTs = ts
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  sparks = sparks.filter(s => s.life > 0)
  sparks.forEach(s => { s.update(dt); s.draw(ctx) })
  animId = requestAnimationFrame(animate)
}
animate.lastTs = 0

export function useClickSpark() {
  if (canvas) return // singleton
  canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999'
  document.body.appendChild(canvas)
  ctx = canvas.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  document.addEventListener('click', onClick)
  animId = requestAnimationFrame(animate)
}

export function destroyClickSpark() {
  if (animId) cancelAnimationFrame(animId)
  document.removeEventListener('click', onClick)
  window.removeEventListener('resize', resize)
  if (canvas) canvas.remove()
  canvas = null; ctx = null; sparks = []; animId = null
}
