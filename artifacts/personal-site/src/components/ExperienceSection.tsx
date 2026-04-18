import ExperienceItem from "./ExperienceItem";

const experiences = [
  {
    title: "Software Engineer Intern",
    company: "Databricks",
    duration: "Apr 2026 - Present",
    location: "Mountain View, California, United States",
    description: "Delta Sharing",
    skills: [],
    companyUrl: "https://databricks.com",
    bgColor: "#E84D37",
  },
  {
    title: "Machine Learning Engineer",
    company: "Mercor",
    duration: "Nov 2025 - Jan 2026",
    location: "Remote",
    description: "Agentic machine learning trajectories",
    skills: [],
    companyUrl: "https://mercor.com",
    bgColor: "#6366F1",
  },
  {
    title: "Software Development Engineer Intern",
    company: "Amazon",
    duration: "May 2025 - Aug 2025",
    location: "Bellevue, Washington, United States",
    description: "Agentic analysis with RAG",
    skills: [],
    companyUrl: "https://amazon.com",
    bgColor: "#FF9900",
  },
  {
    title: "Undergraduate Research Assistant",
    company: "University of North Carolina at Chapel Hill",
    duration: "Feb 2025 - May 2025",
    location: "Chapel Hill, North Carolina, United States",
    description: "Sentiment classification",
    skills: [],
    companyUrl: "https://unc.edu",
    bgColor: "#4B9CD3",
  },
  {
    title: "Software Engineer Intern",
    company: "Fidelity Investments",
    duration: "Jun 2024 - Aug 2024",
    location: "Durham, North Carolina, United States",
    description: "Internal tooling",
    skills: [],
    companyUrl: "https://fidelity.com",
    bgColor: "#4CAF50",
  },
];

export default function ExperienceSection() {
  return (
    <section>
      <h2 className="text-lg font-bold mb-4">Experience</h2>
      <div className="space-y-0">
        {experiences.map((exp, i) => (
          <ExperienceItem key={i} {...exp} isLast={i === experiences.length - 1} />
        ))}
      </div>
    </section>
  );
}
