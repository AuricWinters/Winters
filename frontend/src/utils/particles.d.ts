// Type shim for particles.js — 1133 行自包含引擎，暂不迁移源码
declare module '../utils/particles.js' {
  export function initParticles(config: {
    canvas: HTMLCanvasElement
    count?: number
    color?: string
    connectDistance?: number
    speed?: number
    interaction?: 'attract' | 'repel' | 'none'
    displayConnections?: boolean
  }): { destroy: () => void }
}
