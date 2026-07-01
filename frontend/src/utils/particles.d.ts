// Type shim for particles.js — 1133 行自包含引擎，暂不迁移源码
interface ParticlesInstance {
  explode: (x: number, y: number) => void;
}

interface ParticlesStatic {
  init: (config: Record<string, any>) => ParticlesInstance;
  destroy: () => void;
}

declare const Particles: ParticlesStatic;
export default Particles;
