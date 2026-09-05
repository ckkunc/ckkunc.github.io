import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Square,
  X,
} from "lucide-react";
import { portfolioTracks } from "@/content";

const skills = [
  {
    label: "Languages",
    value: "Python, Java, C, SQL, JavaScript, TypeScript, HTML/CSS, Swift",
  },
  {
    label: "ML + Data",
    value: "Pandas, data pipelines, AWS Bedrock, REST APIs, LLM evaluation",
  },
  {
    label: "Frameworks",
    value: "React, Angular, NestJS, Django, Flask, FastAPI, Material UI",
  },
  {
    label: "Infrastructure",
    value: "AWS, Docker, PostgreSQL, CI/CD, scalable services",
  },
];

function twoDigits(value: number) {
  return String(value).padStart(2, "0");
}

export default function Home() {
  const [activeTrack, setActiveTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const trackRefs = useRef<(HTMLElement | null)[]>([]);
  const contactTriggerRef = useRef<HTMLButtonElement | null>(null);
  const contactSheetRef = useRef<HTMLElement | null>(null);
  const current = portfolioTracks[activeTrack];

  const goToTrack = (index: number) => {
    const bounded = Math.max(0, Math.min(portfolioTracks.length - 1, index));
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    trackRefs.current[bounded]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });
    setActiveTrack(bounded);
  };

  useEffect(() => {
    const visibility = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          visibility.set(entry.target, entry.intersectionRatio),
        );
        const nearest = Array.from(visibility.entries())
          .filter(([, ratio]) => ratio > 0)
          .sort((a, b) => b[1] - a[1])[0]?.[0] as HTMLElement | undefined;

        if (nearest) {
          setActiveTrack(Number(nearest.dataset.trackIndex));
        }
      },
      {
        rootMargin: "-26% 0px -34%",
        threshold: [0, 0.15, 0.35, 0.6],
      },
    );

    trackRefs.current.forEach(
      (element) => element && observer.observe(element),
    );
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        contactOpen ||
        target.closest("a, button, input, textarea, select") ||
        target.isContentEditable ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        if (activeTrack < portfolioTracks.length - 1) {
          event.preventDefault();
          goToTrack(activeTrack + 1);
        }
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        if (activeTrack > 0) {
          event.preventDefault();
          goToTrack(activeTrack - 1);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeTrack, contactOpen]);

  useEffect(() => {
    if (!contactOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContactOpen(false);
        return;
      }

      if (event.key !== "Tab" || !contactSheetRef.current) return;
      const focusable = Array.from(
        contactSheetRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", onDialogKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onDialogKeyDown);
      contactTriggerRef.current?.focus();
    };
  }, [contactOpen]);

  return (
    <>
      <a className="skip-link" href="#experience">
        Skip to experience
      </a>

      <header className="site-header">
        <a className="mini-wordmark" href="#top" aria-label="Story home">
          STORY
        </a>
        <nav aria-label="Primary navigation">
          <a href="#experience">Experience</a>
          <a href="#side-b">Skills</a>
          <a href="https://github.com/ckkunc" target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight aria-hidden="true" />
          </a>
        </nav>
      </header>

      <main id="top" className="portfolio-shell">
        <aside
          className="player-stage"
          aria-label="Interactive career cassette player"
        >
          <div className="player-wrap">
            <div className="orange-button-wrap">
              <span>OPEN LINE</span>
              <button
                className="orange-button"
                type="button"
                ref={contactTriggerRef}
                onClick={() => setContactOpen(true)}
                aria-label="Open contact details"
              >
                CONTACT
              </button>
            </div>

            <div
              className={`story-player ${isPlaying ? "is-playing" : "is-paused"}`}
            >
              <div className="player-edge player-edge-top" aria-hidden="true" />
              <div
                className="player-edge player-edge-left"
                aria-hidden="true"
              />

              <div className="player-face">
                <div className="brand-lockup">
                  <div className="story-wordmark">STORY</div>
                  <div className="series-label">PERSONAL STEREO NOTES</div>
                </div>

                <div className="utility-copy" aria-hidden="true">
                  <span>STEREO</span>
                  <span>FIELD RECORDER</span>
                </div>

                <div className="cassette-bay">
                  <div className="bay-glare" aria-hidden="true" />
                  <div className="cassette">
                    <div className="cassette-label">
                      <div className="label-topline">
                        <span>CHRIS K KIM</span>
                        <span>SIDE A</span>
                      </div>
                      <div className="cassette-track-title">
                        {current.company}
                      </div>
                      <div className="cassette-track-role">{current.role}</div>
                      <div className="tape-rule" />
                      <div className="label-bottomline">
                        <span>CAREER MIX</span>
                        <span>
                          {twoDigits(activeTrack + 1)} /{" "}
                          {twoDigits(portfolioTracks.length)}
                        </span>
                      </div>
                    </div>

                    <div className="reel-row" aria-hidden="true">
                      <div className="reel reel-left">
                        <span />
                      </div>
                      <div className="tape-run">
                        <span />
                      </div>
                      <div className="reel reel-right">
                        <span />
                      </div>
                    </div>

                    <div className="cassette-footer" aria-hidden="true">
                      <i />
                      <span>LOW NOISE · HIGH OUTPUT</span>
                      <i />
                    </div>
                  </div>
                </div>

                <div className="player-instruction">
                  SCROLL OR USE THE TRANSPORT KEYS
                </div>
              </div>

              <div className="control-rail">
                <div className="rail-heading">MEMORY PLAYER</div>

                <div className="counter" aria-live="polite" aria-atomic="true">
                  <span>TRACK</span>
                  <strong>{twoDigits(activeTrack + 1)}</strong>
                  <small>{current.subtitle}</small>
                </div>

                <div className="volume-bank" aria-hidden="true">
                  <div>
                    <span>L</span>
                    <i />
                  </div>
                  <div>
                    <span>R</span>
                    <i />
                  </div>
                </div>

                <div
                  className="transport"
                  role="group"
                  aria-label="Experience transport controls"
                >
                  <button
                    type="button"
                    onClick={() => goToTrack(activeTrack - 1)}
                    disabled={activeTrack === 0}
                    aria-label="Previous experience"
                  >
                    <RotateCcw aria-hidden="true" />
                    <span>REW</span>
                  </button>
                  <button
                    type="button"
                    className="play-key"
                    onClick={() => setIsPlaying((value) => !value)}
                    aria-label={
                      isPlaying
                        ? "Pause cassette animation"
                        : "Play cassette animation"
                    }
                  >
                    {isPlaying ? (
                      <Pause aria-hidden="true" />
                    ) : (
                      <Play aria-hidden="true" />
                    )}
                    <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => goToTrack(activeTrack + 1)}
                    disabled={activeTrack === portfolioTracks.length - 1}
                    aria-label="Next experience"
                  >
                    <RotateCw aria-hidden="true" />
                    <span>FWD</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlaying(false)}
                    aria-label="Stop cassette animation"
                  >
                    <Square aria-hidden="true" />
                    <span>STOP</span>
                  </button>
                </div>

                <div className="jack-links">
                  <a
                    href="https://github.com/ckkunc"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Chris Kim on GitHub"
                  >
                    <span className="jack">
                      <Github aria-hidden="true" />
                    </span>
                    GITHUB
                  </a>
                  <a
                    href="https://www.linkedin.com/in/chris-kim-unc/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Chris Kim on LinkedIn"
                  >
                    <span className="jack">
                      <Linkedin aria-hidden="true" />
                    </span>
                    LINKEDIN
                  </a>
                </div>
              </div>

              <div className="player-screw screw-one" aria-hidden="true" />
              <div className="player-screw screw-two" aria-hidden="true" />
              <div className="player-screw screw-three" aria-hidden="true" />
            </div>

            <div className="device-caption">
              <span>ST-01</span>
              <span>SCROLL · ARROW KEYS · TRANSPORT</span>
            </div>
          </div>
        </aside>

        <div className="liner-notes">
          <section className="intro-panel" aria-labelledby="intro-title">
            <p className="eyebrow">PORTFOLIO / 2027 EDITION</p>
            <h1 id="intro-title">
              Systems that move
              <br />
              <em>at human speed.</em>
            </h1>
            <p className="intro-copy">
              I'm Christopher Kim, a computer science student and software
              engineer building secure infrastructure, agentic AI systems, and
              thoughtful products at scale.
            </p>
            <div className="intro-actions">
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(true);
                  goToTrack(0);
                }}
              >
                Play side A <ArrowDown aria-hidden="true" />
              </button>
              <a href="mailto:chriskkim2025@gmail.com">
                chriskkim2025@gmail.com
              </a>
            </div>
            <div className="intro-stats" aria-label="Quick facts">
              <div>
                <strong>{twoDigits(portfolioTracks.length)}</strong>
                <span>roles on side A</span>
              </div>
              <div>
                <strong>25+ TB</strong>
                <span>duplicate storage avoided</span>
              </div>
              <div>
                <strong>2.5x</strong>
                <span>faster incident resolution</span>
              </div>
            </div>
          </section>

          <section
            id="experience"
            className="track-sequence"
            aria-label="Experience playlist"
          >
            <div className="sequence-heading">
              <span>SIDE A</span>
              <h2>Experience</h2>
              <p>{portfolioTracks.length} tracks. One continuous build.</p>
            </div>

            {portfolioTracks.map((track, index) => (
              <article
                className={`track-card ${activeTrack === index ? "is-active" : ""}`}
                id={`track-${index + 1}`}
                data-track-index={index}
                ref={(element) => {
                  trackRefs.current[index] = element;
                }}
                key={track.company}
                style={{ "--track-color": track.color } as CSSProperties}
                aria-label={`Track ${index + 1}: ${track.company}, ${track.role}`}
              >
                <div className="track-index">
                  <span>TRACK</span>
                  <strong>{twoDigits(index + 1)}</strong>
                </div>
                <div className="track-content">
                  <div className="track-meta">
                    <span>{track.dates}</span>
                    <span>{track.location}</span>
                  </div>
                  <p className="track-kicker">{track.subtitle}</p>
                  <h3>{track.company}</h3>
                  <h4>{track.role}</h4>
                  <ul>
                    {track.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <div
                    className="tag-row"
                    aria-label="Technologies and focus areas"
                  >
                    {track.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section
            id="side-b"
            className="side-b"
            aria-labelledby="side-b-title"
          >
            <div className="sequence-heading inverse">
              <span>SIDE B</span>
              <h2 id="side-b-title">Foundation</h2>
              <p>The education and tools behind the work.</p>
            </div>

            <article className="education-card">
              <div>
                <p className="eyebrow">EDUCATION / DEC 2026</p>
                <h3>
                  University of North Carolina
                  <br />
                  at Chapel Hill
                </h3>
                <p>B.S. in Computer Science · Major GPA 3.74 / 4.00</p>
              </div>
              <div className="course-list">
                <span>Algorithms + Analysis</span>
                <span>Software Engineering</span>
                <span>Design Patterns</span>
                <span>Files + Databases</span>
                <span>Computer Organization</span>
                <span>Theory of Computation</span>
              </div>
            </article>

            <div className="skills-grid">
              {skills.map((skill, index) => (
                <article key={skill.label}>
                  <span>{twoDigits(index + 1)}</span>
                  <h3>{skill.label}</h3>
                  <p>{skill.value}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="closing-card" aria-labelledby="closing-title">
            <p className="eyebrow">END OF SIDE B</p>
            <h2 id="closing-title">Let's make the next track.</h2>
            <p>
              I'm always happy to talk about infrastructure, ML systems, and
              ambitious product ideas.
            </p>
            <div className="closing-links">
              <a href="mailto:chriskkim2025@gmail.com">
                <Mail aria-hidden="true" /> Email me
              </a>
              <a
                href="https://www.linkedin.com/in/chris-kim-unc/"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin aria-hidden="true" /> LinkedIn
              </a>
              <a
                href="https://github.com/ckkunc"
                target="_blank"
                rel="noreferrer"
              >
                <Github aria-hidden="true" /> GitHub
              </a>
            </div>
          </section>

          <footer>
            <span>© {new Date().getFullYear()} Christopher Kim</span>
            <span>
              An independent portfolio interface. No brand affiliation or
              endorsement.
            </span>
          </footer>
        </div>
      </main>

      {contactOpen && (
        <div
          className="contact-backdrop"
          role="presentation"
          onMouseDown={() => setContactOpen(false)}
        >
          <section
            className="contact-sheet"
            ref={contactSheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="contact-close"
              type="button"
              onClick={() => setContactOpen(false)}
              aria-label="Close contact panel"
              autoFocus
            >
              <X aria-hidden="true" />
            </button>
            <p className="eyebrow">OPEN LINE / CHANNEL 01</p>
            <h2 id="contact-title">Say hello.</h2>
            <p>For opportunities, collaborations, or a good systems problem.</p>
            <a
              className="contact-primary"
              href="mailto:chriskkim2025@gmail.com"
            >
              <Mail aria-hidden="true" /> chriskkim2025@gmail.com
            </a>
            <div className="contact-secondary">
              <a
                href="https://www.linkedin.com/in/chris-kim-unc/"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin aria-hidden="true" /> LinkedIn
              </a>
              <a
                href="https://github.com/ckkunc"
                target="_blank"
                rel="noreferrer"
              >
                <Github aria-hidden="true" /> GitHub
              </a>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
