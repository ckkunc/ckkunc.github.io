import ExperienceSection from "@/components/ExperienceSection";
import Timeline from "@/components/Timeline";
import { name, about, writing, contact } from "@/content";

function HoverLi({ html, children }: { html?: string; children?: React.ReactNode }) {
  const base = "transition-all duration-150 ease-out rounded px-1.5 -mx-1.5 py-0.5 hover:bg-black/[0.05] hover:scale-[1.03] origin-left cursor-default list-item";
  if (html) {
    return <li className={base} dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <li className={base}>{children}</li>;
}

export default function Home() {
  return (
    <div className="flex px-8 py-10 gap-16">
      <div className="w-[720px] flex-shrink-0">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-4">{name}</h1>

          <section className="mb-6">
            <ul className="list-disc list-inside space-y-0.5 ml-1">
              {about.map((item, i) => (
                <HoverLi key={i} html={item} />
              ))}
            </ul>
          </section>

          {writing.length > 0 && (
            <section className="mb-6">
              <p className="mb-2">Some things I wrote:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-1">
                {writing.map((item, i) => (
                  <HoverLi key={i}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.label}
                    </a>
                  </HoverLi>
                ))}
              </ul>
            </section>
          )}
        </header>

        <ExperienceSection />

        <section className="mt-8 mb-6">
          <p className="mb-2">Contact me:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-1">
            {contact.map((item, i) => (
              <HoverLi key={i}>
                {item.label}:{" "}
                <a href={item.url}>{item.text}</a>
              </HoverLi>
            ))}
          </ul>
        </section>
      </div>

      <div className="flex-1 min-w-0 pt-14">
        <Timeline />
      </div>
    </div>
  );
}
