import { useEffect, useRef, useState } from "react";
import { createObservatoryRenderer, observatoryFrame, observatoryProgress } from "@/lib/observatory";
import { name } from "@/content";

export default function ObservatoryScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const section = sectionRef.current, canvas = canvasRef.current;
    if (!section || !canvas) return;
    const renderer = createObservatoryRenderer(canvas);
    if (!renderer) { setUnavailable(true); return; }
    let request = 0, lastFrame = -Infinity, progress = 0, visible = true, dirty = true;
    let seconds = 0, lastTick = 0;
    const animated = !reducedMotion;
    const tick = (timestamp: number) => {
      request = 0;
      if (!visible || document.hidden) { lastTick = 0; return; }
      if (lastTick && animated) seconds += Math.min((timestamp - lastTick) / 1000, 0.1);
      lastTick = timestamp;
      if (dirty || (animated && timestamp - lastFrame >= 1000 / 24)) {
        renderer.draw(progress, seconds, reducedMotion);
        lastFrame = timestamp; dirty = false;
      }
      if (animated) request = window.requestAnimationFrame(tick);
    };
    const render = () => {
      dirty = true;
      if (!request && visible && !document.hidden) request = window.requestAnimationFrame(tick);
    };
    const measure = () => {
      const rect = section.getBoundingClientRect();
      progress = observatoryProgress(rect.top, rect.height, canvas.getBoundingClientRect().height);
      const frame = observatoryFrame(progress, reducedMotion);
      section.style.setProperty("--title-opacity", String(frame.titleOpacity));
      section.style.setProperty("--title-shift", `${-24 * (1 - frame.titleOpacity)}px`);
      render();
    };
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      renderer.resize(bounds.width, bounds.height, window.devicePixelRatio || 1);
      measure();
    };
    const visibility = () => {
      lastTick = 0;
      if (document.hidden) { window.cancelAnimationFrame(request); request = 0; }
      else render();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { measure(); lastTick = 0; }
      else { window.cancelAnimationFrame(request); request = 0; lastTick = 0; }
    });
    observer.observe(section);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener("scroll", measure, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    resize();
    return () => {
      window.cancelAnimationFrame(request);
      observer.disconnect(); resizeObserver.disconnect();
      window.removeEventListener("scroll", measure);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [reducedMotion]);

  return <section ref={sectionRef} className="observatory" data-reduced-motion={reducedMotion} aria-label="A little perspective">
    <div className="observatory-stage">
      <canvas ref={canvasRef} className="observatory-canvas" aria-hidden="true" />
      {unavailable && <pre className="observatory-fallback" aria-hidden="true">{`       .:xXXx:.
     .xX:    :Xx.
  .:xXXXXxxxxXXXXx:.
     'xX:    :Xx'
       ':xXXx:'`}</pre>}
      <div className="hero-title"><h1>{name}</h1></div>
      <p className="sr-only">An orange black hole made of text characters. Scrolling pulls the view back to a grassy mountain peak with a telescope on the right. A valley and lake open below on the left, with the black hole reflected in the water.</p>
    </div>
  </section>;
}
