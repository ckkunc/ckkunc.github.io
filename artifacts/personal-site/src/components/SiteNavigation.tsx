import { Link, useLocation } from "wouter";

export default function SiteNavigation() {
  const [location] = useLocation();
  const about = /^\/about\/?$/.test(location);
  return <header className="site-navigation" data-page={about ? "about" : "home"}>
    <nav aria-label="Main navigation">
      <Link href="/" aria-current={!about ? "page" : undefined}>Home</Link>
      <Link href="/about/" aria-current={about ? "page" : undefined}>About</Link>
    </nav>
  </header>;
}
