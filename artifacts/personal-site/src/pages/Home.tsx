import { memo, useCallback, useEffect, useReducer, useRef, useState, type CSSProperties, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Content as DialogSurface } from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, FastForward, Pause, Play, Rewind, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import { portfolioTracks } from "@/content";
import { nextTape, wheelPixels } from "@/lib/player";
import { initialTapeLoading, tapeFlightFrames, tapeFlightGeometry, tapeLoadingReducer, type TapeFlight } from "@/lib/tape-loading";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const editions = [
  { label: "Databricks", color: "#ff3621" },
  { label: "Mercor", color: "#5a4afc" },
  { label: "Amazon", color: "#ff9900" },
  { label: "Fidelity", color: "#087b32" },
];
const stories = [
  "I built support for sharing shallow-cloned Delta tables, with secure access and credential handling across S3, Azure, and GCS.",
  "I built a pipeline that ingests and evaluates coding trajectories for Meta’s Code World Model, combining automated validation with model-based review.",
  "I built an AI incident-analysis tool that connects service logs with runbooks and documentation using AWS Bedrock agents.",
  "I built an account-analysis tool for financial associates, with responsive interfaces and real-time personalized recommendations.",
];

function Tape({ index, playing }: { index: number; playing: boolean }) {
  const edition = editions[index];
  return <div className={`tape tape-${edition.label.toLowerCase()} ${playing ? "tape-playing" : ""}`} style={{ "--tape-color": edition.color } as CSSProperties} aria-hidden="true">
    <img className="tape-photo" src={asset("images/cassette.png")} alt="" draggable={false} />
    <div className="tape-stripe" />
    <div className="tape-label"><strong>{edition.label}</strong></div>
    <img src={asset(`images/${edition.label.toLowerCase()}-logo.${index === 3 ? "ico" : "svg"}`)} className="company-logo" alt="" draggable={false} />
    <span className="tape-hub tape-hub-left" /><span className="tape-hub tape-hub-right" />
  </div>;
}

const FlyingTape = memo(function FlyingTape({ flight, onLand }: { flight: TapeFlight; onLand: (id: number) => void }) {
  return createPortal(<div className="tape-flight-layer" aria-hidden="true"><motion.div
    className="flying-tape" style={{ left: flight.left, top: flight.top, width: flight.width, transformOrigin: "0 0" }}
    initial={{ x: 0, y: 0, scale: 1, rotate: 0, clipPath: "inset(0% 0% 0% 0% round 0px)" }}
    animate={tapeFlightFrames(flight)}
    transition={{ duration: .46, ease: "linear" }}
    onAnimationComplete={() => onLand(flight.id)}
  ><Tape index={flight.index} playing={false} /></motion.div></div>, document.body);
});

function CassettePlayer({ index, playing, direction, loading, glint, landedFromShelf, windowRef, onToggle }: { index: number; playing: boolean; direction: number; loading: boolean; glint: number; landedFromShelf: boolean; windowRef: RefObject<SVGGElement | null>; onToggle: () => void }) {
  const reducedMotion = useReducedMotion();
  return <svg className="cassette-player" viewBox="0 125 1122 1110" role="img" aria-label={`Story cassette player with orange headphones. ${editions[index].label} cassette ${playing ? "playing" : "paused"}.`}>
    <defs><clipPath id="cassette-player-cutout">
      <path d="M149 359 C275 214 443 150 582 152 C741 147 875 222 977 349 L971 355 C859 224 734 155 582 158 C423 156 283 222 157 365 Z" />
      <path d="M152 357 L175 351 L193 355 L196 367 L154 478 C139 578 133 668 136 755 L146 784 L137 844 L126 866 L100 846 L88 788 L89 755 L97 749 C91 648 100 552 110 477 L139 384 Z" />
      <path d="M963 351 L978 347 L998 351 L1026 458 L1029 479 L1030 718 L1038 737 L1034 764 L1008 779 L991 726 L989 479 L955 382 L954 367 Z" />
      <path d="M137 789 C144 767 173 758 206 759 L216 762 L213 672 L232 666 L232 644 L260 636 L320 639 L343 635 L348 628 L486 622 L489 628 L907 616 L937 620 L940 632 L973 633 L979 641 L979 729 C1002 720 1030 735 1050 764 C1063 787 1073 814 1075 835 L1092 829 L1094 841 L1081 893 L1065 900 C1053 939 1036 965 1008 969 L977 969 L977 1120 Q977 1136 963 1140 L253 1193 Q227 1195 216 1176 L214 1106 L214 1015 L193 1015 C168 1013 154 996 145 972 L128 958 L115 950 L99 927 L100 843 L121 837 L129 849 Z" />
      <path d="M151 961 C139 1000 153 1036 173 1068 Q186 1088 218 1093 L218 1100 Q178 1093 166 1071 C143 1037 132 1001 144 960 Z" />
    </clipPath></defs>
    <image href={asset("images/story-cassette-player.png")} width="1122" height="1402" clipPath="url(#cassette-player-cutout)" />
    <g ref={windowRef} transform="translate(531 918) rotate(-3.8)"><foreignObject width="318" height="146">
      <div className="glass-window"><AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <motion.div key={`${index}:${glint}`} className="loaded-tape" custom={direction} variants={{ enter: (d: number) => ({ y: reducedMotion || landedFromShelf ? 0 : d * -155, opacity: landedFromShelf ? 1 : 0, rotate: reducedMotion || landedFromShelf ? 0 : -4 }), center: { y: 0, opacity: 1, rotate: 0 }, ejected: { y: reducedMotion ? 0 : 145, opacity: 0, rotate: reducedMotion ? 0 : 3 }, exit: (d: number) => ({ y: reducedMotion ? 0 : d * 155, opacity: 0, rotate: reducedMotion ? 0 : 4 }) }} initial="enter" animate={loading ? "ejected" : "center"} exit="exit" transition={{ duration: reducedMotion ? .1 : .3, ease: [.22, 1, .36, 1] }}><Tape index={index} playing={playing && !loading} /></motion.div>
      </AnimatePresence><div className="glass-reflection" />{glint > 0 && !reducedMotion && <motion.div key={glint} className="glass-glint" style={{ visibility: loading ? "hidden" : "visible" }} initial={{ x: "-140%", opacity: 0 }} animate={{ x: ["-140%", "-32%", "150%", "290%"], opacity: [0, .7, .45, 0] }} transition={{ duration: .56, ease: "easeInOut", times: [0, .25, .65, 1] }} />}</div>
    </foreignObject></g>
    <foreignObject x="340" y="612" width="155" height="55"><button type="button" tabIndex={-1} className="hardware-hotspot" onClick={onToggle} aria-label={playing ? "Pause cassette reels" : "Play cassette reels"} title={playing ? "Pause" : "Play"} /></foreignObject>
  </svg>;
}

export default function Home() {
  const [loadingState, dispatch] = useReducer(tapeLoadingReducer, initialTapeLoading);
  const { index, direction, flight, storyOpen, glint, landedFromShelf } = loadingState;
  const reducedMotion = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(false);
  const aboutTrigger = useRef<HTMLButtonElement>(null);
  const storyTrigger = useRef<HTMLButtonElement | null>(null);
  const shelfRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const windowRef = useRef<SVGGElement>(null);
  const selectionRef = useRef(0);
  selectionRef.current = loadingState.requestedIndex;
  const roomRef = useRef<HTMLElement>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const selectTape = useCallback((next: number, openNotes = false, travelDirection?: number) => {
    const previous = selectionRef.current;
    selectionRef.current = next;
    const source = shelfRefs.current[next]?.getBoundingClientRect();
    const matrix = windowRef.current?.getScreenCTM() ?? null;
    const geometry = !reducedMotion && !storyOpen && source ? tapeFlightGeometry(source, matrix) : null;
    dispatch({ type: "select", index: next, direction: travelDirection ?? (next >= previous ? 1 : -1), geometry, openNotes });
  }, [reducedMotion, storyOpen]);
  const choose = useCallback((next: number) => selectTape(next), [selectTape]);
  const step = useCallback((delta: number) => selectTape(nextTape(selectionRef.current, delta, editions.length), storyOpen, delta), [selectTape, storyOpen]);
  const land = useCallback((id: number) => dispatch({ type: "land", id }), []);

  useEffect(() => {
    const cancel = () => dispatch({ type: "cancel" });
    const onVisibility = () => { if (document.hidden) cancel(); };
    window.addEventListener("resize", cancel);
    window.addEventListener("scroll", cancel);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { window.removeEventListener("resize", cancel); window.removeEventListener("scroll", cancel); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  useEffect(() => { if (reducedMotion && flight) land(flight.id); }, [reducedMotion, flight, land]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Tab") { dispatch({ type: "cancel" }); return; }
      if (aboutOpen || storyOpen || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable=true], [role=dialog]")) return;
      if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) { event.preventDefault(); if (!event.repeat) step(event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1); }
      else if (event.code === "Space" && !target.closest("button, a")) { event.preventDefault(); if (!event.repeat) setPlaying(value => !value); }
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [step, aboutOpen, storyOpen]);

  useEffect(() => {
    let accumulated = 0, lastWheel = 0, changedAt = -1000;
    const onWheel = (event: WheelEvent) => {
      if (aboutOpen || storyOpen || event.ctrlKey || event.metaKey || Math.abs(event.deltaY) < Math.abs(event.deltaX) || event.deltaY === 0) return;
      if (document.documentElement.scrollHeight <= window.innerHeight + 2) event.preventDefault();
      const now = performance.now(), delta = wheelPixels(event.deltaY, event.deltaMode, window.innerHeight);
      if (now - lastWheel > 180 || Math.sign(accumulated) !== Math.sign(delta)) accumulated = 0;
      lastWheel = now;
      if (now - changedAt < 500) return;
      accumulated += delta;
      if (Math.abs(accumulated) >= 45) { step(Math.sign(accumulated)); accumulated = 0; changedAt = now; }
    };
    const room = roomRef.current;
    room?.addEventListener("wheel", onWheel, { passive: false }); return () => room?.removeEventListener("wheel", onWheel);
  }, [step, aboutOpen, storyOpen]);

  return <div className="portfolio">
    <a className="skip-link" href="#player-controls">Skip to player controls</a>
    <header className="site-header">
      <h1><a href="#" onClick={event => { event.preventDefault(); choose(0); }}>Chris Kim</a></h1>
      <nav aria-label="Main navigation"><button ref={aboutTrigger} onClick={() => { dispatch({ type: "cancel" }); setAboutOpen(true); }}>About</button></nav>
    </header>
    <main ref={roomRef} className="listening-room" aria-label="Christopher Kim’s experience tapes">
      <section className="player-stage" aria-label="Interactive cassette player"
        onTouchStart={event => { const t = event.touches[0]; touchRef.current = { x: t.clientX, y: t.clientY }; }}
        onTouchEnd={event => { const start = touchRef.current; touchRef.current = null; if (!start) return; const t = event.changedTouches[0], dx = t.clientX - start.x, dy = t.clientY - start.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1); }}>
        <div className="device-wrap"><CassettePlayer index={index} playing={playing} direction={direction} loading={!!flight} glint={glint} landedFromShelf={landedFromShelf} windowRef={windowRef} onToggle={() => setPlaying(value => !value)} /></div>
        <div className="transport" id="player-controls" role="group" aria-label="Cassette controls" tabIndex={-1}>
          <button type="button" onClick={() => step(-1)} aria-label="Previous cassette" title="Previous cassette (←)"><Rewind aria-hidden="true" fill="currentColor" strokeWidth={1} /></button>
          <button type="button" className="play-button" onClick={() => setPlaying(value => !value)} aria-label={playing ? "Pause cassette animation" : "Play cassette animation"} aria-pressed={playing} title="Play / pause (Space)">{playing ? <Pause aria-hidden="true" fill="currentColor" strokeWidth={1} /> : <Play aria-hidden="true" fill="currentColor" strokeWidth={1} />}</button>
          <button type="button" onClick={() => step(1)} aria-label="Next cassette" title="Next cassette (→)"><FastForward aria-hidden="true" fill="currentColor" strokeWidth={1} /></button>
        </div>
        <p className="interaction-hint"><span className="desktop-hint">Scroll or use ← →</span><span className="mobile-hint">Swipe to switch tapes</span></p>
      </section>
      <aside className="tape-shelf" aria-labelledby="shelf-title">
        <div className="shelf-heading"><h2 id="shelf-title">A few chapters.</h2><p>Pick a tape to explore.</p></div>
        <nav className="tape-collection" aria-label="Read about an experience">{[0, 1].map(row => <div className="shelf-row" key={row}>{editions.slice(row * 2, row * 2 + 2).map((edition, column) => { const i = row * 2 + column; return <button key={edition.label} ref={node => { shelfRefs.current[i] = node; }} className={`library-tape ${i === loadingState.requestedIndex ? "selected" : ""} ${flight?.index === i ? "is-loading" : ""}`} onClick={event => { storyTrigger.current = event.currentTarget; selectTape(i, true); }} aria-label={`Read about ${portfolioTracks[i].company}`} aria-haspopup="dialog" aria-pressed={i === loadingState.requestedIndex} style={{ "--accent": edition.color } as CSSProperties}><Tape index={i} playing={false} /><span className="tape-number" aria-hidden="true">0{i + 1}</span></button>; })}</div>)}</nav>
      </aside>
    </main>
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">Cassette {index + 1} of 4: {portfolioTracks[index].company}.</div>
    <Dialog open={aboutOpen} onOpenChange={setAboutOpen}><DialogContent className="about-dialog" onCloseAutoFocus={event => { event.preventDefault(); aboutTrigger.current?.focus(); }}>
      <DialogTitle>Hi, I’m Chris.</DialogTitle>
      <DialogDescription>A software engineer studying computer science at UNC Chapel Hill. I like building systems, working with AI, and making things work together.</DialogDescription>
      <div className="about-links"><a href="https://github.com/ckkunc" target="_blank" rel="noreferrer">GitHub <ArrowUpRight aria-hidden="true" /></a><a href="https://www.linkedin.com/in/chris-kim-unc/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight aria-hidden="true" /></a><a href={asset("Christopher-Kim-Resume.pdf")} target="_blank" rel="noreferrer">Résumé <ArrowUpRight aria-hidden="true" /></a></div>
    </DialogContent></Dialog>
    <Dialog open={storyOpen} onOpenChange={open => dispatch({ type: "notes", open })}><DialogPortal><DialogOverlay className="liner-overlay" /><DialogSurface className="about-dialog story-dialog" style={{ "--liner-accent": editions[index].color } as CSSProperties} onCloseAutoFocus={event => { event.preventDefault(); (storyTrigger.current ?? shelfRefs.current[index])?.focus({ preventScroll: true }); }}>
      <div className="liner-sheet">
        <div className="liner-spine" aria-hidden="true"><span>Chris Kim · 0{index + 1}</span></div>
        <div className="liner-cover"><div className="liner-edition" aria-hidden="true"><span>Side A</span><span>0{index + 1} / 04</span></div><div className="story-tape"><Tape index={index} playing={false} /></div><p className="liner-caption">Liner notes</p></div>
        <div className="liner-notes"><div className="story-heading"><DialogTitle>{portfolioTracks[index].company}</DialogTitle><DialogDescription>{portfolioTracks[index].role}<br />{portfolioTracks[index].dates}</DialogDescription></div>
          <p className="story-summary">{stories[index]}</p>
          <div className="story-navigation"><button onClick={() => step(-1)} aria-label="Read previous experience"><ArrowLeft aria-hidden="true" /> Previous</button><button onClick={() => step(1)} aria-label="Read next experience">Next <ArrowRight aria-hidden="true" /></button></div>
        </div>
      </div>
      <DialogClose className="liner-close" aria-label="Close liner notes"><X aria-hidden="true" /></DialogClose>
    </DialogSurface></DialogPortal></Dialog>
    {flight && !reducedMotion && <FlyingTape key={flight.id} flight={flight} onLand={land} />}
  </div>;
}
