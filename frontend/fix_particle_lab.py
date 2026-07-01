with open('src/views/lab/ParticleLab.vue', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix `let particles = []` -> `let particles: any[] = []`
content = content.replace('let particles = [];', 'let particles: any[] = [];')
print("Fixed: particles type")

# 2. Fix `let mouse = { x: null, y: null }` -> typed
content = content.replace('let mouse = { x: null, y: null };', 'let mouse: { x: number | null; y: number | null } = { x: null, y: null };')
print("Fixed: mouse type")

# 3. Fix `let animationId = null` -> typed
content = content.replace('let animationId = null;', 'let animationId: number | null = null;')
print("Fixed: animationId type")

# 4. Fix `const canvasRef = ref(null)` -> typed
content = content.replace('const canvasRef = ref(null);', 'const canvasRef = ref<HTMLCanvasElement | null>(null);')
print("Fixed: canvasRef type")

# 5. Fix Particle class - add property declarations
old_class = """class Particle {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * config.speed * 2;
    this.vy = (Math.random() - 0.5) * config.speed * 2;
    this.radius = Math.random() * config.sizeVariations + 2;
    this.color = getRandomColor();
  }"""

new_class = """class Particle {
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
  }"""

if old_class in content:
    content = content.replace(old_class, new_class)
    print("Fixed: Particle class property declarations")
else:
    print("WARNING: Particle class pattern not found!")
    # Try to find alternatives
    import re
    m = re.search(r'class Particle', content)
    if m:
        print(f"Found 'class Particle' at position {m.start()}")

# 6. Fix updateParticles function - remove `arguments` usage
old_func = """function updateParticles() {
  const refreshColors = Boolean(arguments[0]?.refreshColors);"""

new_func = """function updateParticles(options?: { refreshColors?: boolean }) {
  const refreshColors = options?.refreshColors ?? false;"""

if old_func in content:
    content = content.replace(old_func, new_func)
    print("Fixed: updateParticles function signature and arguments usage")
else:
    print("WARNING: updateParticles pattern not found!")

with open('src/views/lab/ParticleLab.vue', 'w', encoding='utf-8') as f:
    f.write(content)
print("ParticleLab.vue done")
