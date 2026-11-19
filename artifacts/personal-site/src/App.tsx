import { useEffect } from "react";
import { Link, Route, Router, Switch, useLocation } from "wouter";
import Home from "@/pages/Home";
import About from "@/pages/About";
import SiteNavigation from "@/components/SiteNavigation";

function Pages() {
  const [location] = useLocation();
  useEffect(() => {
    const about = /^\/about\/?$/.test(location);
    const title = about ? "About — Chris Kim" : "Chris Kim";
    const description = about ? "Chris Kim. Computer science at UNC Chapel Hill, AI, distributed systems, and a little curiosity." : "Chris Kim. A little perspective.";
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", `https://chris-kim.dev/${about ? "og-pond.png" : "og.png"}`);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", `https://chris-kim.dev/${about ? "about/" : ""}`);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", description);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", `https://chris-kim.dev/${about ? "og-pond.png" : "og.png"}`);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://chris-kim.dev/${about ? "about/" : ""}`);
    window.scrollTo(0, 0);
  }, [location]);
  return <Switch>
    <Route path="/about" component={About} />
    <Route path="/" component={Home} />
    <Route><main className="missing-page"><h1>A little off course.</h1><Link href="/">Back home</Link></main></Route>
  </Switch>;
}

export default function App() {
  return <Router base={import.meta.env.BASE_URL.replace(/\/$/, "")}><SiteNavigation /><Pages /></Router>;
}
