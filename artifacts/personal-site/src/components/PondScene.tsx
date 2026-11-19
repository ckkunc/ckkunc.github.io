import { useEffect, useRef } from "react";
import { createPondRenderer, type PondRipple } from "@/lib/pond";

export default function PondScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createPondRenderer(canvas);
    if (!renderer) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = preference.matches, request = 0, lastDraw = -Infinity, previous = 0, seconds = 0, dirty = true;
    let ripples: PondRipple[] = [];
    const tick = (timestamp: number) => {
      request = 0;
      if (document.hidden) { previous = 0; return; }
      if (previous && !reduced) seconds += Math.min((timestamp - previous) / 1000, 0.1);
      previous = timestamp;
      if (dirty || (!reduced && timestamp - lastDraw >= 1000 / 24)) {
        ripples = ripples.filter(r => seconds - r.started < 9);
        renderer.draw(seconds, ripples, reduced);
        lastDraw = timestamp; dirty = false;
      }
      if (!reduced) request = requestAnimationFrame(tick);
    };
    const render = () => {
      dirty = true;
      if (!request && !document.hidden) request = requestAnimationFrame(tick);
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      renderer.resize(rect.width, rect.height, window.devicePixelRatio || 1);
      render();
    };
    const onPreference = () => {
      reduced = preference.matches; previous = 0; ripples = [];
      cancelAnimationFrame(request); request = 0; render();
    };
    const onVisibility = () => {
      previous = 0;
      if (document.hidden) { cancelAnimationFrame(request); request = 0; }
      else render();
    };
    const onPointer = (event: PointerEvent) => {
      if (reduced || (event.target instanceof Element && event.target.closest("a, button, input, summary"))) return;
      const rect = canvas.getBoundingClientRect();
      ripples = [...ripples.slice(-3), { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height, started: seconds }];
      render();
    };
    const observer = new ResizeObserver(resize); observer.observe(canvas);
    preference.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointerdown", onPointer, { passive: true });
    resize();
    return () => {
      cancelAnimationFrame(request); observer.disconnect();
      preference.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, []);
  return <canvas ref={canvasRef} className="pond-canvas" style={{ position: "fixed", inset: 0, width: "100%", height: "100%" }} aria-hidden="true" />;
}
