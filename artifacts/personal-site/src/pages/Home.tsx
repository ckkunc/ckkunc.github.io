import ExperienceSection from "@/components/ExperienceSection";
import { name, about, writing, contact, footer as footerText } from "@/content";

export default function Home() {
  return (
    <div className="max-w-2xl px-8 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-4">{name}</h1>

        <section className="mb-6">
          <p className="mb-2">Some things about me:</p>
          <ul className="list-disc list-inside space-y-1 ml-1">
            {about.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </section>

        {writing.length > 0 && (
          <section className="mb-6">
            <p className="mb-2">Some things I wrote:</p>
            <ul className="list-disc list-inside space-y-1 ml-1">
              {writing.map((item, i) => (
                <li key={i}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </header>

      <ExperienceSection />

      <section className="mt-8 mb-6">
        <p className="mb-2">
          Some places to <span className="underline">find</span> me:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          {contact.map((item, i) => (
            <li key={i}>
              {item.label}:{" "}
              <a href={item.url}>{item.text}</a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-12 pt-6 border-t border-border">
        {footerText && <p className="text-right text-sm text-muted-foreground italic">{footerText}</p>}
      </footer>
    </div>
  );
}
