import { experiences } from "@/content";

export default function ExperienceSection() {
  return (
    <section className="max-w-[560px]">
      <h2 className="text-lg font-bold mb-4">Experience</h2>
      <ul className="space-y-1 ml-1">
        {experiences.map((exp, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 transition-all duration-150 ease-out rounded px-1.5 -mx-1.5 py-0.5 hover:bg-black/[0.05] hover:scale-[1.03] origin-left cursor-default"
          >
            <span
              className="flex-shrink-0 w-2 h-2 rounded-full mt-[5px]"
              style={{ backgroundColor: exp.bgColor }}
            />
            <span className="text-sm">
              <span className="font-semibold">{exp.title}</span>
              {" · "}
              <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="no-underline hover:underline">
                {exp.company}
              </a>
              {" · "}
              <span className="text-muted-foreground">{exp.duration}</span>
              {exp.description && (
                <> · <span className="text-muted-foreground">{exp.description}</span></>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
