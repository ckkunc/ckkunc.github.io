export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};
const noise = (a: number, b = 0) => {
  const seed = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return seed - Math.floor(seed);
};
const gaussian = (value: number, spread: number) => Math.exp(-(value * value) / spread);

/** Use the actual travel distance of the sticky section, including on mobile. */
export function observatoryProgress(top: number, sectionHeight: number, viewportHeight: number) {
  const distance = sectionHeight - viewportHeight;
  return distance > 0 ? clamp(-top / distance) : 0;
}

export function observatoryFrame(progress: number, reducedMotion = false) {
  const p = clamp(progress);
  return {
    pullback: reducedMotion ? 1 : ease(0.04, 0.91, p),
    landscape: reducedMotion ? 1 : ease(0.26, 0.96, p),
    stars: reducedMotion ? 1 : ease(0.05, 0.74, p),
    titleOpacity: reducedMotion ? 1 : 1 - ease(0.12, 0.43, p),
    hintOpacity: reducedMotion ? 0 : 1 - ease(0.03, 0.21, p),
  };
}

/** An eleven-second gust travels left to right, followed by a long quiet interval. */
export function grassWind(seconds: number, position: number) {
  const cycle = ((seconds - clamp(position) * 5.5) % 28 + 28) % 28;
  if (cycle <= 5 || cycle >= 16) return 0;
  const envelope = Math.sin((Math.PI * (cycle - 5)) / 11) ** 2;
  return envelope * (0.82 + 0.18 * Math.sin(seconds * 0.72 - position * 3));
}

type Point = { x: number; y: number };
type Sample = Point & { seed: number };
type Line = { from: Point; to: Point; width: number };
function distanceToLine(x: number, y: number, { from, to }: Line) {
  const dx = to.x - from.x, dy = to.y - from.y;
  const t = clamp(((x - from.x) * dx + (y - from.y) * dy) / (dx * dx + dy * dy));
  return Math.hypot(x - from.x - t * dx, y - from.y - t * dy);
}

/** A deterministic character field; scrolling changes the camera, not the artwork's identity. */
export function createObservatoryRenderer(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return null;
  const ctx = context;
  let width = 0, height = 0, cellWidth = 5.6, cellHeight = 10;
  let samples: Sample[] = [];
  let grass: Array<{ x: number; depth: number; seed: number }> = [];
  const stars = Array.from({ length: 240 }, (_, i) => ({
    x: noise(i + 37, 1), y: noise(i + 37, 2) * 0.78,
    brightness: noise(i + 37, 3), shape: noise(i + 37, 4),
  }));
  const ramp = ".,:;irsxXS$@";
  const colors = Array.from({ length: 128 }, (_, i) => {
    const power = (i / 127) * 1.3;
    return `hsl(${11 + power * 27} 95% ${Math.min(92, 25 + power * 51)}%)`;
  });

  function resize(nextWidth: number, nextHeight: number, pixelRatio: number) {
    width = Math.max(1, nextWidth); height = Math.max(1, nextHeight);
    const ratio = clamp(pixelRatio, 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    cellWidth = width < 600 ? 4.2 : width > 1600 ? 6.4 : 5.4;
    cellHeight = cellWidth * 1.75;
    ctx.font = `${cellWidth * 1.65}px Menlo, Consolas, monospace`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    samples = [];
    const tuftCount = Math.ceil(width / 6);
    grass = Array.from({ length: tuftCount }, (_, i) => ({
      x: (i + noise(i, 61)) / tuftCount,
      depth: noise(i, 62) ** 1.35,
      seed: noise(i, 63),
    }));
    for (let row = 1, y = cellHeight; y < height; row++, y += cellHeight) {
      for (let column = 1, x = cellWidth; x < width; column++, x += cellWidth) {
        samples.push({ x, y, seed: noise(column, row) });
      }
    }
  }

  function draw(progress: number, seconds = 0, reducedMotion = false) {
    if (!width || !height) return;
    const frame = observatoryFrame(progress, reducedMotion);
    const time = reducedMotion ? 0 : seconds;
    const revolution = time * 0.095;
    const tilt = Math.sin(time * 0.065) * 0.24;
    const turnCos = Math.cos(tilt), turnSin = Math.sin(tilt);
    const depth = 0.94 + Math.cos(time * 0.065) * 0.06;
    const cx = mix(width * 0.56, width * 0.47, frame.pullback);
    const cy = mix(height * 0.43, height * 0.24, frame.pullback);
    const radius = mix(Math.min(width * 0.255, height * 0.285), Math.min(width * 0.047, height * 0.059), frame.pullback);
    ctx.globalAlpha = 1; ctx.shadowBlur = 0; ctx.fillStyle = "#080909";
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      if (width < 600 && star.brightness > 0.66) continue;
      const x = star.x * width, y = star.y * height;
      if (Math.hypot((x - cx) / radius, (y - cy) / (radius * 0.95)) < 0.89) continue;
      const twinkle = 0.87 + Math.sin(time * 0.33 + i * 1.7) * 0.13;
      ctx.globalAlpha = (0.05 + frame.stars * 0.72) * (0.4 + star.brightness * 0.6) * twinkle;
      ctx.fillStyle = star.shape > 0.93 ? "#edd2b0" : "#a9b5b4";
      ctx.fillText(star.shape > 0.965 ? "+" : star.shape > 0.88 ? "*" : ".", x, y);
    }
    const lift = (1 - frame.landscape) * height * 0.4;
    const farHorizon = (x: number) => height * (0.66 + 0.022 * Math.sin(x * 21) + 0.014 * Math.cos(x * 39)) + lift;
    const middleHorizon = (x: number) => height * (0.76 + 0.035 * Math.sin(x * 9 + 1) + 0.012 * Math.sin(x * 27)) + lift;
    const hill = (x: number) => height * (0.94 - 0.15 * Math.exp(-Math.pow((x - 0.75) / 0.34, 2)) + 0.02 * Math.sin(x * 8)) + lift;
    if (frame.landscape > 0) {
      for (const { x, y, seed } of samples) {
        const nx = x / width, far = farHorizon(nx), middle = middleHorizon(nx), near = hill(nx);
        if (y < far - cellHeight) continue;
        if (y < near) {
          if (seed > 0.29 && Math.abs(y - far) > cellHeight && Math.abs(y - middle) > cellHeight) continue;
          ctx.fillStyle = y < middle ? "#818e83" : "#52654c";
          ctx.globalAlpha = frame.landscape * (Math.abs(y - far) < cellHeight ? 0.39 : y > middle ? 0.22 : 0.11);
          ctx.fillText(Math.abs(y - far) < cellHeight ? (seed > 0.5 ? "^" : ".") : seed > 0.15 ? ":" : ".", x, y);
        } else {
          const edge = y - near;
          if (edge > cellHeight * 2 && seed > 0.64) continue;
          ctx.globalAlpha = frame.landscape * (edge < cellHeight * 1.6 ? 0.57 : 0.11 + seed * 0.24);
          ctx.fillStyle = edge < cellHeight * 1.6 ? "#4f7550" : "#355b3b";
          ctx.fillText(edge < cellHeight * 1.6 ? (seed > 0.6 ? '"' : "^") : seed > 0.47 ? ";" : seed > 0.25 ? "," : ".", x, y);
        }
      }
    }
    for (const { x, y, seed } of samples) {
      const screenX = (x - cx) / radius, screenY = (y - cy) / (radius * 0.96);
      const bx = screenX * turnCos + screenY * turnSin;
      const by = (-screenX * turnSin + screenY * turnCos) / depth;
      if (Math.abs(bx) > 2.7 || Math.abs(by) > 1.6) continue;
      const r = Math.hypot(bx, by), angle = Math.atan2(by, bx);
      const orbitAngle = angle - revolution;
      const flow = 0.67 + 0.2 * Math.sin(orbitAngle * 13 + r * 29) + 0.13 * Math.sin(orbitAngle * 7 - r * 17);
      let light = (gaussian(r - 1.015, 0.004) * 0.93 + gaussian(r - 1.13, 0.052) * 0.58 * flow) * Math.max(0.15, 1.12 - bx * 0.63);
      const band = by - 0.17 - bx * 0.09;
      const disk = gaussian(band, 0.009 + 0.008 * Math.abs(bx)) * gaussian(bx + 0.1, 2.1) * (0.92 - bx * 0.27);
      light += disk;
      if (r < 0.88 && by < 0.08) light *= 0.015;
      if (r < 0.88 && by >= 0.08) light = disk * 0.72;
      light *= 0.66 + seed * 0.48;
      if (light < 0.1) continue;
      const power = Math.min(light, 1.3);
      ctx.fillStyle = colors[Math.min(127, Math.floor((power / 1.3) * 127))];
      ctx.globalAlpha = Math.min(1, power + 0.17);
      ctx.shadowColor = "#ff782b"; ctx.shadowBlur = power > 0.68 ? 3 : 0;
      ctx.fillText(ramp[Math.min(ramp.length - 1, Math.floor(power * 8))], x, y);
    }
    ctx.shadowBlur = 0;
    if (frame.landscape > 0) {
      // Rooted blades bend along their length; gusts move through clumps rather than flickering pixels.
      for (const tuft of grass) {
        const horizon = hill(tuft.x);
        const baseY = horizon + tuft.depth * (height - horizon + 30);
        const wind = reducedMotion ? 0 : grassWind(time, tuft.x);
        const heightScale = clamp(height / 800, 0.78, 1.25);
        for (let blade = 0; blade < 3; blade++) {
          const seed = noise(tuft.seed * 100 + blade, 73);
          const bladeHeight = (9 + tuft.depth * 49) * (0.58 + seed * 0.65) * heightScale;
          const rootX = tuft.x * width + (blade - 1) * (2 + tuft.depth * 5);
          const bend = (seed - 0.5) * bladeHeight * 0.22 + wind * bladeHeight * (0.24 + seed * 0.1);
          const steps = Math.max(2, Math.ceil(bladeHeight / (cellHeight * 0.76)));
          ctx.fillStyle = tuft.depth > 0.4 ? "#4a7042" : "#3b5d3b";
          ctx.globalAlpha = frame.landscape * (0.4 + tuft.depth * 0.18 + wind * 0.06);
          for (let step = 0; step <= steps; step++) {
            const t = step / steps;
            const x = rootX + bend * t * t, y = baseY - bladeHeight * t;
            if (y > height || y < 0) continue;
            const slope = (2 * bend * t) / bladeHeight;
            const glyph = step === steps ? "'" : slope > 0.12 ? "/" : slope < -0.12 ? "\\" : "|";
            ctx.fillText(glyph, x, y);
          }
        }
      }
      const scale = clamp(Math.min(width / 1050, height / 750), 0.58, 1.2);
      const anchor = { x: width * 0.77, y: hill(0.77) - height * 0.007 };
      const point = (x: number, y: number): Point => ({ x: anchor.x + x * scale, y: anchor.y + y * scale });
      const tip = point(-123, -175), end = point(-10, -102), hub = point(-48, -78);
      const tube: Line = { from: tip, to: end, width: 10 * scale };
      const lines: Line[] = [
        { from: point(-48, -103), to: hub, width: 4 * scale },
        { from: hub, to: point(-101, 1), width: 3 * scale },
        { from: hub, to: point(13, 7), width: 3 * scale },
        { from: hub, to: point(-39, 12), width: 2.6 * scale },
        { from: point(-78, -27), to: point(-12, -27), width: 1.8 * scale },
        { from: end, to: point(6, -91), width: 4 * scale },
        { from: point(-103, -179), to: point(-81, -165), width: 2 * scale },
      ];
      for (const { x, y, seed } of samples) {
        if (x < anchor.x - 143 * scale || x > anchor.x + 24 * scale || y < anchor.y - 190 * scale || y > anchor.y + 19 * scale) continue;
        const barrel = distanceToLine(x, y, tube) < tube.width;
        const lens = Math.hypot(x - tip.x, y - tip.y) < 12 * scale;
        const joint = Math.hypot(x - hub.x, y - hub.y) < 6 * scale;
        const hardware = lines.some(line => distanceToLine(x, y, line) < Math.max(line.width, cellWidth * 0.58));
        if (!barrel && !lens && !hardware && !joint) continue;
        ctx.globalAlpha = frame.landscape * 0.97;
        ctx.fillStyle = barrel || lens ? "#ddc5a2" : "#af9781";
        ctx.fillText(lens ? "@" : barrel ? (seed > 0.5 ? "#" : "=") : joint ? "O" : y > hub.y ? (x < hub.x ? "/" : "\\") : "+", x, y);
      }
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  }
  return { resize, draw };
}
