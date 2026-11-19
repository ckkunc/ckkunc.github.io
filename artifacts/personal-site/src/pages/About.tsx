import PondScene from "@/components/PondScene";
import { contact } from "@/content";

export default function About() {
  return <main className="about-page">
    <PondScene />
    <div className="pond-shade" aria-hidden="true" />
    <section className="about-copy" aria-labelledby="about-heading">
      <h1 id="about-heading">About me</h1>
      <p>I’m Chris, a computer science student at <a href="https://www.unc.edu/" target="_blank" rel="noreferrer">UNC Chapel Hill</a>. I’m interested in AI, distributed systems, and understanding how things work.</p>
      <p>I like making things, following interesting questions, and leaving a little room for curiosity.</p>
      <nav className="pond-contact" aria-label="Get in touch">{contact.map(item => <a key={item.label} href={item.url} target={item.label === "Email" ? undefined : "_blank"} rel={item.label === "Email" ? undefined : "noreferrer"}>{item.label}</a>)}</nav>
    </section>
    <p className="sr-only">Ivory and muted rust koi swim beneath a dark teal pond. Fine currents, concentric ripples, lily pads, and reflected points of starlight form the water’s surface.</p>
  </main>;
}
