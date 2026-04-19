import ExperienceItem from "./ExperienceItem";
import { experiences } from "@/content";

export default function ExperienceSection() {
  return (
    <section className="max-w-[560px]">
      <h2 className="text-lg font-bold mb-4">Experience</h2>
      <div className="space-y-0">
        {experiences.map((exp, i) => (
          <ExperienceItem
            key={i}
            {...exp}
            location=""
            skills={[]}
            isLast={i === experiences.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
