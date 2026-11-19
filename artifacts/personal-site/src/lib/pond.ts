const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const noise = (x: number, y = 0) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
};

export type PondRipple = { x: number; y: number; started: number };
type Point = { x: number; y: number };
type Cell = Point & { seed: number };
type Fish = Point & { length: number; angle: number; phase: number; silver: boolean };

/** A spreading, fading surface ripple; its coordinates remain relative to the pond on resize. */
export function rippleAt(distance: number, age: number) {
  if (age < 0 || age > 9) return 0;
  const radius = 0.018 + age * 0.037;
  const envelope = Math.sin((Math.PI * age) / 9) ** 0.7;
  const ring = Math.exp(-Math.pow((distance - radius) / 0.009, 2));
  const echo = Math.exp(-Math.pow((distance - radius * 0.77) / 0.006, 2)) * 0.38;
  return (ring + echo) * envelope;
}

/** A smooth, rounded head, full shoulders, and a tapered tail stock. */
export function koiWidth(t: number) {
  if (t < 0 || t > 1) return 0;
  const profile = [0.26, 0.74, 0.96, 1, 0.94, 0.83, 0.69, 0.53, 0.37, 0.23, 0.12];
  const index = t * (profile.length - 1), left = Math.min(profile.length - 2, Math.floor(index));
  const f = index - left;
  return mix(profile[left], profile[left + 1], f * f * (3 - 2 * f));
}

export function pondFish(width: number, height: number, seconds: number): Fish[] {
  const compact = width < 700;
  const size = compact ? Math.min(width * 0.48, height * 0.25) : Math.min(width * 0.29, height * 0.42);
  const paths = compact ? [
    { cx: 0.5, cy: 0.3, rx: 0.29, ry: 0.21, rate: 0.095, phase: -0.95, scale: 1, silver: false },
    { cx: 0.5, cy: 0.3, rx: 0.19, ry: 0.13, rate: -0.11, phase: 2.2, scale: 0.84, silver: true },
  ] : [
    { cx: 0.55, cy: 0.46, rx: 0.33, ry: 0.3, rate: 0.075, phase: -0.9, scale: 1, silver: false },
    { cx: 0.55, cy: 0.46, rx: 0.21, ry: 0.18, rate: -0.085, phase: 0.8, scale: 0.89, silver: true },
    { cx: 0.55, cy: 0.46, rx: 0.43, ry: 0.4, rate: 0.058, phase: 2.8, scale: 0.72, silver: false },
  ];
  return paths.map(path => {
    const t = seconds * path.rate + path.phase;
    const vx = -path.rx * width * Math.sin(t) * path.rate;
    const vy = path.ry * height * Math.cos(t) * path.rate;
    return {
      x: width * (path.cx + path.rx * Math.cos(t)),
      y: height * (path.cy + path.ry * Math.sin(t)),
      length: size * path.scale,
      angle: Math.atan2(vy, vx),
      phase: path.phase,
      silver: path.silver,
    };
  });
}

export function createPondRenderer(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return null;
  const ctx = context;
  let width = 0, height = 0, cellW = 4.8, cellH = 7.4;
  let cells: Cell[] = [];
  let background: CanvasGradient | string = "#071212";
  const glints = Array.from({ length: 235 }, (_, i) => ({ x: noise(i, 41), y: noise(i, 42), brightness: noise(i, 43), phase: noise(i, 44) * Math.PI * 2 }));
  const bodyRamp = ".,:;ixXS#%@";
  const cream = ["#666f5e", "#7c8571", "#939a82", "#a9af94", "#c0c4a9", "#d4d5bb"];
  const rust = ["#51362d", "#6d4031", "#8c4c36", "#a45c41", "#bd7050", "#cb8661"];
  const silver = ["#465d56", "#637c6e", "#829481", "#a1af96", "#bcc4a7", "#d0d1b4"];
  const fins = ["#536a57", "#6b8067", "#85977b", "#a2ae8d", "#bcc3a2"];

  function resize(w: number, h: number, pixelRatio: number) {
    width = Math.max(1, w); height = Math.max(1, h);
    const ratio = clamp(pixelRatio, 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    cellW = width < 600 ? 3.6 : width > 1700 ? 5.4 : 4.6;
    cellH = cellW * 1.55;
    ctx.font = `${cellW * 1.65}px Menlo, Consolas, monospace`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const glow = ctx.createRadialGradient(width * 0.75, height * 0.4, 0, width * 0.68, height * 0.45, Math.max(width, height) * 0.8);
    glow.addColorStop(0, "#102522"); glow.addColorStop(0.6, "#091817"); glow.addColorStop(1, "#060d0e");
    background = glow;
    cells = [];
    for (let row = 1, y = cellH; y < height; row++, y += cellH) {
      for (let column = 1, x = cellW; x < width; column++, x += cellW) cells.push({ x, y, seed: noise(column, row) });
    }
  }

  const clarity = (x: number, y: number) => {
    if (width < 700) return 0.75 + 0.25 * (1 - clamp((y / height - 0.45) / 0.3));
    return 0.45 + 0.55 * clamp((x / width - 0.26) / 0.3);
  };

  function surface(seconds: number, ripples: PondRipple[]) {
    const time = seconds;
    const natural: PondRipple[] = [
      { x: 0.77, y: 0.4, started: time - ((time + 3) % 18) },
      { x: 0.46, y: 0.89, started: time - ((time + 9) % 22) },
    ];
    const active = [...natural, ...ripples].filter(r => time - r.started >= 0 && time - r.started <= 9);
    const dimension = Math.min(width, height);
    for (const { x, y, seed } of cells) {
      const nx = x / width, ny = y / height;
      const current = Math.sin(nx * 24 + ny * 9 + Math.sin(ny * 9 - time * 0.065) * 2.8 + time * 0.095)
        + Math.sin(ny * 47 - nx * 8 + Math.sin(nx * 9 + time * 0.04) * 1.7 - time * 0.12) * 0.44;
      const crease = Math.exp(-Math.pow((current - 0.48) / 0.075, 2));
      const undertone = Math.sin(nx * 71 + ny * 33 + time * 0.05) * 0.5 + 0.5;
      let ring = 0;
      for (const ripple of active) {
        const distance = Math.hypot((x - ripple.x * width) / dimension, (y - ripple.y * height) / (dimension * 0.58));
        ring += rippleAt(distance, time - ripple.started);
      }
      if (crease < 0.06 && ring < 0.025 && seed > 0.13) continue;
      const strength = Math.max(crease * 0.48, ring * 0.8);
      ctx.fillStyle = strength > 0.5 ? "#7e9d8b" : crease > 0.35 ? "#4e7f70" : "#2b4b46";
      ctx.globalAlpha = (0.065 + strength * 0.57 + undertone * 0.025) * clarity(x, y);
      const glyph = ring > 0.3 ? "~" : crease > 0.5 ? (seed > 0.6 ? "~" : "-") : seed > 0.7 ? ":" : seed > 0.32 ? "," : ".";
      ctx.fillText(glyph, x, y);
    }
  }

  function lilyPads(seconds: number) {
    const compact = width < 700;
    const pads = compact ? [
      { x: width * 0.03, y: height * 0.11, radius: width * 0.12, angle: 0.9 },
      { x: width * 0.92, y: height * 0.46, radius: width * 0.085, angle: -1.2 },
    ] : [
      { x: width * 0.46, y: height * 0.09, radius: Math.min(width * 0.042, height * 0.07), angle: 0.9 },
      { x: width * 0.505, y: height * 0.13, radius: Math.min(width * 0.032, height * 0.055), angle: -0.3 },
      { x: width * 0.92, y: height * 0.61, radius: Math.min(width * 0.035, height * 0.065), angle: -1.2 },
    ];
    for (const pad of pads) {
      const px = pad.x + Math.sin(seconds * 0.08 + pad.angle) * 2;
      const py = pad.y + Math.cos(seconds * 0.07 + pad.angle) * 1.5;
      for (const { x, y, seed } of cells) {
        if (Math.abs(x - px) > pad.radius || Math.abs(y - py) > pad.radius * 0.67) continue;
        const dx = (x - px) / pad.radius, dy = (y - py) / (pad.radius * 0.67);
        const r = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
        const gap = Math.atan2(Math.sin(a - pad.angle), Math.cos(a - pad.angle));
        if (r > 1 || (Math.abs(gap) < 0.17 && r > 0.16)) continue;
        const vein = Math.abs(Math.sin(a * 7 + r * 0.5)) < 0.14;
        ctx.fillStyle = r > 0.9 ? "#45634a" : vein ? "#3f5c46" : "#284a39";
        ctx.globalAlpha = (r > 0.9 ? 0.68 : 0.37 + seed * 0.17) * clarity(x, y);
        ctx.fillText(r > 0.9 ? ":" : vein ? ";" : seed > 0.5 ? "," : ".", x, y);
      }
    }
  }

  function drawFish(fish: Fish, seconds: number) {
    const { length: L, angle, phase } = fish;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const motion = seconds * 0.78 + phase;
    const spine = (t: number) => Math.sin(motion - t * 4.2) * (0.003 + t * t * 0.07) * L
      + Math.sin(phase + seconds * 0.12) * Math.sin(t * Math.PI) * L * 0.05;
    const reach = L * 1.12;
    for (const { x, y, seed } of cells) {
      if (Math.abs(x - fish.x) > reach || Math.abs(y - fish.y) > reach) continue;
      const dx = x - fish.x, dy = y - fish.y;
      const lx = dx * cos + dy * sin, ly = -dx * sin + dy * cos;
      const t = 0.5 - lx / L;
      let fin = false, finDetail = 0, finEdge = 0;
      // Long pectoral fins flow back from the shoulders, with fine radial ribs.
      const ft = (0.27 - lx / L) / 0.49;
      if (ft > 0 && ft < 1) {
        const center = (0.06 + Math.sin(ft * Math.PI * 0.5) * 0.235) * L;
        const spread = Math.sin(Math.PI * ft) ** 0.72 * L * 0.074;
        const wobble = Math.sin(motion * 0.65 + ft * 3.8) * L * 0.013 * ft;
        const d = Math.abs(Math.abs(ly - spine(0.3)) - center - wobble) / spread;
        if (d < 1) { fin = true; finEdge = d; finDetail = Math.sin(ft * 51 + Math.abs(ly) * 0.14); }
      }
      const pelvic = (0.02 - lx / L) / 0.44;
      if (pelvic > 0.3 && pelvic < 1) {
        const d = Math.abs(Math.abs(ly - spine(0.7)) - (0.065 + pelvic * 0.1) * L) / (Math.sin(Math.PI * pelvic) * L * 0.035);
        if (d < 1) { fin = true; finEdge = d; finDetail = Math.sin(pelvic * 44); }
      }
      const tailT = (-lx / L - 0.48) / 0.49;
      if (tailT > 0 && tailT < 1) {
        const center = spine(1) + Math.sin(motion - 4.2 - tailT * 2.5) * L * tailT * 0.08;
        const spread = L * (0.012 + 0.205 * Math.sin(tailT * Math.PI * 0.52) ** 1.25);
        const d = Math.abs(ly - center) / spread;
        const notch = Math.max(0, (tailT - 0.44) / 0.56) * 0.7;
        if (d < 1 && d > notch) { fin = true; finEdge = d; finDetail = Math.sin(d * 25 + tailT * 12); }
      }
      let halfWidth = 0, cross = 0;
      const body = t >= 0 && t <= 1 && (halfWidth = koiWidth(t) * L * 0.12) > 0 && (cross = Math.abs(ly - spine(t)) / halfWidth) < 1;
      if (!body && !fin) continue;
      const visibility = clarity(x, y);
      if (fin && !body) {
        const light = clamp(0.36 + finDetail * 0.21 + (1 - finEdge) * 0.26);
        ctx.globalAlpha = (0.46 + light * 0.44) * visibility;
        ctx.fillStyle = fins[Math.min(fins.length - 1, Math.floor(light * fins.length))];
        ctx.fillText(finDetail > 0.52 ? ";" : finDetail > 0 ? ":" : seed > 0.45 ? "," : ".", x, y);
        continue;
      }
      const normalizedSide = (ly - spine(t)) / (L * 0.12);
      const patches = [
        { t: 0.16, y: -0.34, a: 0.1, b: 0.72 },
        { t: 0.39, y: 0.42, a: 0.14, b: 0.85 },
        { t: 0.65, y: -0.12, a: 0.11, b: 0.7 },
        { t: 0.86, y: 0.12, a: 0.08, b: 0.52 },
      ];
      let patch = 0;
      for (const spot of patches) {
        const u = (t - spot.t) / spot.a, v = (normalizedSide - spot.y) / spot.b;
        patch = Math.max(patch, Math.exp(-(u * u + v * v) * 1.2) + Math.sin(t * 69 + normalizedSide * 11 + phase) * 0.065);
      }
      const shading = 0.48 + Math.sqrt(1 - cross * cross) * 0.43;
      const scale = Math.sin(t * 132 + Math.floor(normalizedSide * 6) * 1.6) * 0.075;
      const light = clamp(shading + scale + seed * 0.07);
      const darkSpot = fish.silver && Math.sin(t * 27 - normalizedSide * 4) + Math.cos(t * 39 + normalizedSide * 6) > 1.35;
      const red = patch > (fish.silver ? 0.55 : 0.4);
      const palette = red ? rust : fish.silver ? silver : cream;
      ctx.globalAlpha = (0.76 + light * 0.22) * visibility;
      ctx.fillStyle = darkSpot ? "#263d35" : palette[Math.min(palette.length - 1, Math.floor(light * (palette.length - 1)))];
      const symbol = bodyRamp[Math.min(bodyRamp.length - 1, Math.floor((light * 0.67 + seed * 0.23) * bodyRamp.length))];
      ctx.fillText(symbol, x, y);
      // A faint surface current passes over the koi, placing it under the water.
      if (Math.sin(x * 0.04 + y * 0.08 + seconds * 0.12) > 0.994 && seed > 0.6) {
        ctx.globalAlpha = 0.21 * visibility; ctx.fillStyle = "#9ab2a1"; ctx.fillText("~", x, y);
      }
    }
    const world = (lx: number, ly: number): Point => ({ x: fish.x + lx * cos - ly * sin, y: fish.y + lx * sin + ly * cos });
    for (const side of [-1, 1]) {
      const eye = world(L * 0.39, spine(0.11) + side * L * 0.047);
      ctx.globalAlpha = clarity(eye.x, eye.y); ctx.fillStyle = "#101c18";
      ctx.fillText("o", eye.x, eye.y);
      const barbel = world(L * 0.495, side * L * 0.028);
      ctx.globalAlpha = 0.6 * clarity(barbel.x, barbel.y); ctx.fillStyle = "#8d9a7f";
      ctx.fillText(side < 0 ? "'" : ",", barbel.x, barbel.y);
    }
  }

  function reflections(seconds: number) {
    for (const glint of glints) {
      const x = glint.x * width + Math.sin(seconds * 0.15 + glint.y * 24) * 2.6;
      const y = glint.y * height + Math.sin(seconds * 0.19 + glint.x * 17) * 1.1;
      const shimmer = 0.5 + Math.sin(seconds * 0.37 + glint.phase) * 0.5;
      ctx.fillStyle = glint.brightness > 0.86 ? "#c1bda0" : "#87a99a";
      ctx.globalAlpha = (0.13 + shimmer * 0.34) * clarity(x, y);
      ctx.fillText(glint.brightness > 0.94 && shimmer > 0.65 ? "+" : glint.brightness > 0.77 ? ":" : ".", x, y);
      if (glint.brightness > 0.82) {
        ctx.globalAlpha *= 0.32;
        ctx.fillText("-", x - cellW * 1.7, y + Math.sin(seconds * 0.2) * 0.8);
        ctx.fillText("-", x + cellW * 1.7, y - Math.sin(seconds * 0.2) * 0.8);
      }
    }
  }

  function draw(seconds: number, ripples: PondRipple[] = [], reducedMotion = false) {
    if (!width || !height) return;
    const time = reducedMotion ? 0 : seconds;
    ctx.globalAlpha = 1; ctx.shadowBlur = 0; ctx.fillStyle = background; ctx.fillRect(0, 0, width, height);
    surface(time, reducedMotion ? [] : ripples);
    lilyPads(time);
    for (const fish of pondFish(width, height, time)) drawFish(fish, time);
    reflections(time);
    ctx.globalAlpha = 1;
  }
  return { resize, draw };
}
