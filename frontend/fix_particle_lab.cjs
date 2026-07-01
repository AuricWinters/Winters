const fs = require('fs');

let content = fs.readFileSync('src/views/lab/ParticleLab.vue', 'utf-8');

// 1. Fix `let particles = []`
content = content.replace('let particles = [];', 'let particles: any[] = [];');
console.log('Fixed: particles type');

// 2. Fix `let mouse = { x: null, y: null }`
content = content.replace('let mouse = { x: null, y: null };', 'let mouse: { x: number | null; y: number | null } = { x: null, y: null };');
console.log('Fixed: mouse type');

// 3. Fix `let animationId = null`
content = content.replace('let animationId = null;', 'let animationId: number | null = null;');
console.log('Fixed: animationId type');

// 4. Fix `const canvasRef = ref(null)`
content = content.replace('const canvasRef = ref(null);', 'const canvasRef = ref<HTMLCanvasElement | null>(null);');
console.log('Fixed: canvasRef type');

// 5. Fix Particle class - add property declarations
const oldClass = `class Particle {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * config.speed * 2;
    this.vy = (Math.random() - 0.5) * config.speed * 2;
    this.radius = Math.random() * config.sizeVariations + 2;
    this.color = getRandomColor();
  }`;

const newClass = `class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  canvas: any;
  ctx: any;

  constructor(canvas: any, ctx: any) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * config.speed * 2;
    this.vy = (Math.random() - 0.5) * config.speed * 2;
    this.radius = Math.random() * config.sizeVariations + 2;
    this.color = getRandomColor();
  }`;

if (content.includes(oldClass)) {
  content = content.replace(oldClass, newClass);
  console.log('Fixed: Particle class property declarations');
} else {
  console.log('WARNING: Particle class pattern not found');
}

// 6. Fix updateParticles function
const oldFunc = `function updateParticles() {
  const refreshColors = Boolean(arguments[0]?.refreshColors);`;

const newFunc = `function updateParticles(options?: { refreshColors?: boolean }) {
  const refreshColors = options?.refreshColors ?? false;`;

if (content.includes(oldFunc)) {
  content = content.replace(oldFunc, newFunc);
  console.log('Fixed: updateParticles function signature');
} else {
  console.log('WARNING: updateParticles pattern not found');
}

fs.writeFileSync('src/views/lab/ParticleLab.vue', content, 'utf-8');
console.log('ParticleLab.vue done');
