import ExperienceItem from "./ExperienceItem";

const DatabricksLogo = () => (
  <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
    <path d="M12 2L2 7.5V12l10 5.5L22 12V7.5L12 2zm0 2.31L20.12 9 12 13.69 3.88 9 12 4.31zM3.88 10.5L12 15.19l8.12-4.69V13.5L12 18.19 3.88 13.5v-3z"/>
  </svg>
);

const AmazonLogo = () => (
  <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
    <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705a.66.66 0 01-.77.074c-1.082-.9-1.277-1.316-1.87-2.174-1.789 1.821-3.054 2.367-5.373 2.367-2.745 0-4.882-1.694-4.882-5.084 0-2.648 1.435-4.453 3.479-5.337 1.772-.784 4.245-.924 6.134-1.14V6.2c0-.784.06-1.712-.398-2.392-.401-.606-1.163-.857-1.836-.857-1.248 0-2.361.64-2.634 1.969-.056.296-.273.588-.571.603l-3.203-.345c-.27-.06-.569-.281-.491-.697.736-3.876 4.238-5.045 7.376-5.045 1.604 0 3.7.427 4.965 1.637 1.604 1.497 1.451 3.497 1.451 5.675v5.14c0 1.546.641 2.224 1.244 3.059.213.296.259.651-.01.871l-2.611 2.283zm4.626 2.586c-3.348 2.478-8.2 3.797-12.381 3.797-5.859 0-11.13-2.168-15.116-5.775-.312-.282-.034-.667.343-.447 4.303 2.504 9.621 4.009 15.115 4.009 3.705 0 7.782-.769 11.531-2.363.566-.24 1.039.372.508.779z"/>
  </svg>
);

const MercorLogo = () => (
  <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
    <text x="3" y="17" fontSize="14" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">M</text>
  </svg>
);

const UNCLogo = () => (
  <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
    <text x="2" y="17" fontSize="11" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">UNC</text>
  </svg>
);

const FidelityLogo = () => (
  <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
    <text x="5" y="17" fontSize="14" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">F</text>
  </svg>
);

const experiences = [
  {
    title: "Software Engineer Intern",
    company: "Databricks",
    duration: "Apr 2026 - Present · 1 mo",
    location: "Mountain View, California, United States",
    description: "Delta Sharing",
    skills: [],
    logoSvg: <DatabricksLogo />,
    companyUrl: "https://databricks.com",
    bgColor: "#E84D37",
  },
  {
    title: "Machine Learning Engineer",
    company: "Mercor",
    duration: "Nov 2025 - Jan 2026 · 3 mos",
    location: "Remote",
    description: "Agentic machine learning trajectories",
    skills: ["Python (Programming Language)"],
    logoSvg: <MercorLogo />,
    companyUrl: "https://mercor.com",
    bgColor: "#6366F1",
  },
  {
    title: "Software Development Engineer Intern",
    company: "Amazon",
    duration: "May 2025 - Aug 2025 · 4 mos",
    location: "Bellevue, Washington, United States",
    description: "Agentic analysis with RAG",
    skills: ["Python (Programming Language)", "AWS"],
    logoSvg: <AmazonLogo />,
    companyUrl: "https://amazon.com",
    bgColor: "#FF9900",
  },
  {
    title: "Undergraduate Research Assistant",
    company: "University of North Carolina at Chapel Hill",
    duration: "Feb 2025 - May 2025 · 4 mos",
    location: "Chapel Hill, North Carolina, United States",
    description: "Sentiment classification",
    skills: ["Python (Programming Language)", "Pandas"],
    logoSvg: <UNCLogo />,
    companyUrl: "https://unc.edu",
    bgColor: "#4B9CD3",
  },
  {
    title: "Software Engineer Intern",
    company: "Fidelity Investments",
    duration: "Jun 2024 - Aug 2024 · 3 mos",
    location: "Durham, North Carolina, United States",
    description: "Internal tooling",
    skills: [],
    logoSvg: <FidelityLogo />,
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
