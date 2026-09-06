import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronsLeft, ChevronsRight, Download, Github, Linkedin, Mail, Pause, Play, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { contact, portfolioTracks } from "@/content";
import { nextTape, wheelPixels } from "@/lib/player";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const editions = [
  { label: "Databricks", year: "2026", color: "#b84830", paper: "#f0d4bb", role: "Software Engineer Intern", title: "Sharing more. Storing less.", summary: "Built secure sharing for shallow-cloned Delta tables, so teams can share their data without duplicating it.", metric: "25+ TB", outcome: "of duplicate storage avoided", focus: "Distributed systems · Cloud infrastructure" },
  { label: "Mercor", year: "2025–26", color: "#4d5892", paper: "#d2d6eb", role: "Machine Learning Engineer", title: "Better data. Better models.", summary: "Built ingestion and quality control for coding trajectories used to improve Meta’s Code World Model.", metric: "42%", outcome: "less manual review", focus: "Machine learning · Data quality" },
  { label: "Amazon", year: "2025", color: "#a36013", paper: "#efd8a4", role: "Software Development Engineer Intern", title: "Making sense of the noise.", summary: "Turned service logs, runbooks, and documentation into context-aware incident diagnosis with AI agents.", metric: "2.5×", outcome: "faster incident resolution", focus: "AI agents · AWS infrastructure" },
  { label: "Fidelity", year: "2024", color: "#426745", paper: "#d1dcc5", role: "Software Engineer Intern", title: "The right information, sooner.", summary: "Built responsive account-analysis tools and real-time recommendations for financial associates.", metric: "30%", outcome: "faster customer response", focus: "Full-stack engineering · Product" },
];
const skills = [
  ["Languages", "Python, Java, C, SQL, JavaScript, TypeScript, HTML/CSS, Swift"],
  ["ML & data", "Pandas, AWS Bedrock, data pipelines, REST APIs"],
  ["Frameworks", "React, Angular, NestJS, Django, Flask, FastAPI, Material UI"],
  ["Infrastructure", "AWS Lambda, Bedrock, Lex, CloudWatch, Docker, PostgreSQL"],
  ["Developer tools", "Git, LaunchDarkly, Selenium, BeautifulSoup, CI/CD"],
];
type Panel = "notes" | "about" | "contact" | null;

function Tape({ index, playing, miniature = false }: { index: number; playing: boolean; miniature?: boolean }) {
  const edition = editions[index];
  return <div className={`tape ${playing ? "tape-playing" : ""} ${miniature ? "tape-mini" : ""}`} style={{ "--tape-paper": edition.paper, "--tape-accent": edition.color } as CSSProperties} aria-hidden="true">
    <img className="tape-photo" src={asset("images/cassette.png")} alt="" draggable={false} />
    <div className="tape-label"><img src={asset(`images/${edition.label.toLowerCase()}-logo.${index === 3 ? "ico" : "svg"}`)} className="company-logo" alt="" /><span><strong>{edition.label}</strong><small>{edition.role}</small></span></div>
    <div className="tape-stripe" />
    <span className="tape-hub tape-hub-left" /><span className="tape-hub tape-hub-right" />
  </div>;
}

function Walkman({ index, playing, direction, onToggle }: { index: number; playing: boolean; direction: number; onToggle: () => void }) {
  const reducedMotion = useReducedMotion();
  return <svg className="walkman" viewBox="0 125 1122 1110" role="img" aria-label={`Blue and silver Story Walkman with orange headphones. ${editions[index].label} cassette ${playing ? "playing" : "paused"}.`}>
    <defs>
      {/* Mask only the photograph's background, preserving the reference's physical silhouette. */}
      <clipPath id="walkman-cutout">
        <path d="M149 359 C275 214 443 150 582 152 C741 147 875 222 977 349 L971 355 C859 224 734 155 582 158 C423 156 283 222 157 365 Z" />
        <path d="M152 357 L175 351 L193 355 L196 367 L154 478 C139 578 133 668 136 755 L146 784 L137 844 L126 866 L100 846 L88 788 L89 755 L97 749 C91 648 100 552 110 477 L139 384 Z" />
        <path d="M963 351 L978 347 L998 351 L1026 458 L1029 479 L1030 718 L1038 737 L1034 764 L1008 779 L991 726 L989 479 L955 382 L954 367 Z" />
        <path d="M137 789 C144 767 173 758 206 759 L216 762 L213 672 L232 666 L232 644 L260 636 L320 639 L343 635 L348 628 L486 622 L489 628 L907 616 L937 620 L940 632 L973 633 L979 641 L979 729 C1002 720 1030 735 1050 764 C1063 787 1073 814 1075 835 L1092 829 L1094 841 L1081 893 L1065 900 C1053 939 1036 965 1008 969 L977 969 L977 1120 Q977 1136 963 1140 L253 1193 Q227 1195 216 1176 L214 1106 L214 1015 L193 1015 C168 1013 154 996 145 972 L128 958 L115 950 L99 927 L100 843 L121 837 L129 849 Z" />
        <path d="M151 961 C139 1000 153 1036 173 1068 Q186 1088 218 1093 L218 1100 Q178 1093 166 1071 C143 1037 132 1001 144 960 Z" />
      </clipPath>
    </defs>
    <image href={asset("images/story-walkman.png")} width="1122" height="1402" clipPath="url(#walkman-cutout)" />
    <foreignObject x="531" y="918" width="318" height="146" transform="rotate(-3.8 531 918)">
      <div className="glass-window"><AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <motion.div key={index} className="loaded-tape" custom={direction} variants={{ enter: (d: number) => ({ y: reducedMotion ? 0 : d * -155, opacity: 0, rotate: reducedMotion ? 0 : -4 }), center: { y: 0, opacity: 1, rotate: 0 }, exit: (d: number) => ({ y: reducedMotion ? 0 : d * 155, opacity: 0, rotate: reducedMotion ? 0 : 4 }) }} initial="enter" animate="center" exit="exit" transition={{ duration: reducedMotion ? .12 : .48, ease: [.22, 1, .36, 1] }}><Tape index={index} playing={playing} /></motion.div>
      </AnimatePresence><div className="glass-reflection" /></div>
    </foreignObject>
    <foreignObject x="340" y="612" width="155" height="55"><button type="button" tabIndex={-1} className="hardware-hotspot" onClick={onToggle} aria-label={playing ? "Pause cassette reels" : "Play cassette reels"} title={playing ? "Pause" : "Play"} /></foreignObject>
  </svg>;
}

export default function Home() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [panel, setPanel] = useState<Panel>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const openPanel = (next: Panel) => { returnFocus.current = document.activeElement as HTMLElement; setPanel(next); };
  const roomRef = useRef<HTMLElement>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const current = portfolioTracks[index];
  const edition = editions[index];
  const reducedMotion = useReducedMotion();
  const choose = useCallback((newIndex: number) => { setDirection(newIndex >= index ? 1 : -1); setIndex(newIndex); }, [index]);
  const step = useCallback((delta: number) => { setDirection(delta); setIndex(previous => nextTape(previous, delta, portfolioTracks.length)); }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (panel || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable=true], [role=dialog]")) return;
      if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) { event.preventDefault(); if (!event.repeat) step(event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1); }
      else if (event.code === "Space" && !target.closest("button, a")) { event.preventDefault(); if (!event.repeat) setPlaying(value => !value); }
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [step, panel]);

  useEffect(() => {
    let accumulated = 0, lastWheel = 0, changedAt = -1000;
    const onWheel = (event: WheelEvent) => {
      if (panel || event.ctrlKey || event.metaKey || !window.matchMedia("(min-width: 1100px)").matches) return;
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX) || event.deltaY === 0) return;
      if (document.documentElement.scrollHeight <= window.innerHeight + 2) event.preventDefault();
      const now = performance.now(), delta = wheelPixels(event.deltaY, event.deltaMode, window.innerHeight);
      if (now - lastWheel > 180 || Math.sign(accumulated) !== Math.sign(delta)) accumulated = 0;
      lastWheel = now;
      if (now - changedAt < 720) return;
      accumulated += delta;
      if (Math.abs(accumulated) >= 45) { step(Math.sign(accumulated)); accumulated = 0; changedAt = now; }
    };
    const room = roomRef.current;
    room?.addEventListener("wheel", onWheel, { passive: false }); return () => room?.removeEventListener("wheel", onWheel);
  }, [step, panel]);

  return <div className="portfolio" style={{ "--selected-color": edition.color } as CSSProperties}>
    <a className="skip-link" href="#experience">Skip to experience</a>
    <header className="site-header">
      <a className="site-brand" href="#" onClick={() => choose(0)} aria-label="Story — Christopher Kim home">Story<span className="brand-period">.</span></a>
      <span className="header-caption">A PERSONAL STEREO<br /><b>CHRISTOPHER KIM</b></span>
      <nav aria-label="Main navigation"><button onClick={() => openPanel("about")}>About me</button><a href={asset("Christopher-Kim-Resume.pdf")} target="_blank" rel="noreferrer">Résumé <ArrowUpRight aria-hidden="true" /></a><button className="contact-link" onClick={() => openPanel("contact")}><span className="status-dot" /> Let’s talk <ArrowUpRight aria-hidden="true" /></button></nav>
    </header>
    <main ref={roomRef} className="listening-room" id="experience">
      <div className="room-topline"><span>VOLUME 01 — THE WORK SO FAR</span><span>EST. AT UNC CHAPEL HILL</span></div>
      <div className="main-composition">
        <section className="introduction" aria-labelledby="intro-title"><p className="eyebrow"><span className="tiny-square">A</span> AN INTRODUCTION</p><h1 id="intro-title">Chris Kim.<br /><em>Always<br className="desktop-break" /> building.</em></h1><p className="intro-copy">Software engineer.<br />Computer science at UNC.<br />A thing for systems, AI, and<br className="desktop-break" /> making it all work together.</p><button className="text-link about-link" onClick={() => openPanel("about")}><Plus size={15} aria-hidden="true" /> A little more about me</button><div className="handwritten">A few stops along the way.<svg viewBox="0 0 100 46" aria-hidden="true"><path d="M3 10 Q40 67 87 13 M70 15 L90 8 L86 29" /></svg></div></section>
        <section className={`player-stage ${playing ? "is-playing" : "is-paused"}`} aria-label="Interactive cassette player"
          onTouchStart={event => { const t = event.touches[0]; touchRef.current = { x: t.clientX, y: t.clientY }; }}
          onTouchEnd={event => { const start = touchRef.current; touchRef.current = null; if (!start) return; const t = event.changedTouches[0], dx = t.clientX - start.x, dy = t.clientY - start.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1); }}>
          <div className="device-caption"><span className="signal-bars" aria-hidden="true"><i /><i /><i /><i /></span> {playing ? "A STORY IN MOTION" : "TAKE YOUR TIME"}</div>
          <div className="device-wrap"><Walkman index={index} playing={playing} direction={direction} onToggle={() => setPlaying(value => !value)} /></div>
          <div className="transport-row"><span className="transport-code">ST–01<br /><b>STEREO</b></span><div className="transport" role="group" aria-label="Cassette controls"><button onClick={() => step(-1)} aria-label="Previous cassette" title="Previous cassette (←)"><ChevronsLeft aria-hidden="true" /></button><button className="play-button" onClick={() => setPlaying(value => !value)} aria-label={playing ? "Pause cassette animation" : "Play cassette animation"} aria-pressed={playing} title="Play / pause (Space)">{playing ? <Pause aria-hidden="true" fill="currentColor" /> : <Play aria-hidden="true" fill="currentColor" />}</button><button onClick={() => step(1)} aria-label="Next cassette" title="Next cassette (→)"><ChevronsRight aria-hidden="true" /></button></div><span className="transport-code transport-count"><b>{String(index + 1).padStart(2, "0")}</b> / 04<br />SIDE A</span></div>
          <p className="interaction-hint"><span className="desktop-hint">Scroll to switch tapes</span><span className="mobile-hint">Swipe to switch tapes</span><span>or</span><kbd>←</kbd><kbd>→</kbd></p>
        </section>
        <section className="liner-preview" aria-labelledby="now-playing-title"><div className="now-playing-label"><span><i /> NOW {playing ? "PLAYING" : "PAUSED"}</span><span>0{index + 1} / 04</span></div>
          <AnimatePresence mode="wait" initial={false}><motion.div key={index} className="liner-copy" initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }} transition={{ duration: reducedMotion ? .1 : .18 }}><p className="edition-year">{edition.year} · {current.location}</p><h2 id="now-playing-title">{current.company}</h2><p className="role">{current.role}</p><div className="liner-rule" /><h3>{edition.title}</h3><p className="summary">{edition.summary}</p><div className="metric"><strong>{edition.metric}</strong><span>{edition.outcome}</span></div><button className="text-link read-notes" onClick={() => openPanel("notes")}>Read the liner notes <ArrowUpRight size={17} aria-hidden="true" /></button></motion.div></AnimatePresence>
          <div className="focus-line">{edition.focus}</div>
        </section>
      </div>
      <section className="tape-library" aria-label="Select an experience cassette"><div className="library-heading"><span>THE TAPE COLLECTION</span><span>FOUR EXPERIENCES. ONE STORY.</span></div><div className="tape-list">{editions.map((item, i) => <button className={`library-tape ${i === index ? "selected" : ""}`} key={item.label} onClick={() => choose(i)} aria-pressed={i === index} aria-label={`Play ${portfolioTracks[i].company} experience`} style={{ "--tape-accent": item.color } as CSSProperties}><span className="library-number">0{i + 1}</span><span className="library-art"><Tape index={i} playing={false} miniature /></span><span className="library-tape-info"><strong>{item.label}</strong><small>{item.year}</small></span><span className="library-indicator" aria-hidden="true">{i === index ? <span className={`signal-bars ${playing ? "" : "bars-paused"}`}><i /><i /><i /></span> : <Play size={13} />}</span></button>)}</div></section>
    </main>
    <footer className="site-footer"><span>© {new Date().getFullYear()} CHRISTOPHER KIM</span><span className="footer-center">A WORK IN PROGRESS. JUST LIKE ME.</span><a href="mailto:chriskkim2025@gmail.com">SAY HELLO <ArrowUpRight size={13} aria-hidden="true" /></a></footer>
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">Cassette {index + 1} of 4: {current.company}. {current.role}. {current.dates}.</div>
    <Dialog open={panel !== null} onOpenChange={open => { if (!open) setPanel(null); }}><DialogContent className="liner-dialog" onCloseAutoFocus={event => { event.preventDefault(); returnFocus.current?.focus(); }}>
      {panel === "notes" && <><p className="eyebrow dialog-eyebrow">SIDE A · TAPE 0{index + 1} · LINER NOTES</p><DialogTitle>{current.company}</DialogTitle><DialogDescription>{current.role}<br />{current.dates} · {current.location}</DialogDescription><ul className="detail-bullets">{current.bullets.map(b => <li key={b}>{b}</li>)}</ul><div className="skill-tags">{current.tags.map(t => <span key={t}>{t}</span>)}</div><div className="notes-navigation"><button onClick={() => step(-1)}><ArrowLeft size={16} aria-hidden="true" /> Previous tape</button><button onClick={() => step(1)}>Next tape <ArrowRight size={16} aria-hidden="true" /></button></div></>}
      {panel === "about" && <><p className="eyebrow dialog-eyebrow">SIDE B · THE PERSON BEHIND THE TAPES</p><DialogTitle>Hi, I’m Christopher.</DialogTitle><DialogDescription>I’m a computer science student at UNC Chapel Hill, focused on distributed systems, AI/ML, and backend infrastructure.</DialogDescription><div className="education-block"><span className="eyebrow">EDUCATION</span><h3>University of North Carolina<br />at Chapel Hill</h3><p>B.S. in Computer Science<br />Expected December 2026 · Major GPA 3.74 / 4.00</p></div><dl className="skill-list">{skills.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><a className="resume-link" href={asset("Christopher-Kim-Resume.pdf")} target="_blank" rel="noreferrer"><Download size={17} aria-hidden="true" /> Open my résumé <ArrowUpRight size={16} aria-hidden="true" /></a></>}
      {panel === "contact" && <><p className="eyebrow dialog-eyebrow">AN OPEN LINE</p><DialogTitle>Let’s talk.</DialogTitle><DialogDescription>For opportunities, collaborations, or a good systems problem.</DialogDescription><div className="contact-options">{contact.map((item, i) => { const Icon = [Mail, Linkedin, Github][i]; return <a key={item.label} href={item.url} target={i ? "_blank" : undefined} rel={i ? "noreferrer" : undefined}><Icon size={19} aria-hidden="true" /><span><strong>{item.label}</strong><small>{item.text}</small></span><ArrowUpRight size={18} aria-hidden="true" /></a>; })}</div></>}
    </DialogContent></Dialog>
  </div>;
}
