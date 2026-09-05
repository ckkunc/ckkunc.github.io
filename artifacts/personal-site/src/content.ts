export type PortfolioTrack = {
  company: string;
  role: string;
  dates: string;
  location: string;
  subtitle: string;
  color: string;
  bullets: string[];
  tags: string[];
};

export const name = "Christopher Kim";

export const about = [
  "Computer Science at the University of North Carolina at Chapel Hill",
  "Software engineer focused on distributed systems, AI/ML, and backend infrastructure",
];

export const writing: Array<{ label: string; url: string }> = [];

export const contact = [
  {
    label: "Email",
    text: "chriskkim2025@gmail.com",
    url: "mailto:chriskkim2025@gmail.com",
  },
  {
    label: "LinkedIn",
    text: "chris-kim-unc",
    url: "https://www.linkedin.com/in/chris-kim-unc/",
  },
  {
    label: "GitHub",
    text: "ckkunc",
    url: "https://github.com/ckkunc",
  },
];

export const portfolioTracks: PortfolioTrack[] = [
  {
    company: "Databricks",
    role: "Software Engineer Intern",
    dates: "May 2026 - August 2026",
    location: "Mountain View, CA",
    subtitle: "Delta Sharing / OpenSharing",
    color: "#f36b3f",
    bullets: [
      "Developed support for sharing shallow-cloned Delta tables through OpenSharing without duplicating the underlying data.",
      "Built selective credential-vending and authorization workflows through Unity Catalog's dependency-authorization framework.",
      "Designed backend APIs for metadata resolution, access validation, and credential issuance across S3, Azure, and GCS.",
      "Implemented fail-closed, multi-root security controls to prevent cross-table data access.",
      "Rolled the feature out to four private-preview partners, avoiding more than 25 TB of duplicate storage.",
    ],
    tags: ["Distributed systems", "Cloud storage", "Security", "APIs"],
  },
  {
    company: "Mercor",
    role: "Machine Learning Engineer",
    dates: "November 2025 - January 2026",
    location: "Remote",
    subtitle: "Agentic ML trajectories",
    color: "#9b86ff",
    bullets: [
      "Built an end-to-end ingestion and quality-control application for SFT trajectory data used to improve Meta's Code World Model.",
      "Combined deterministic validation gates with multi-criteria LLM-as-judge scoring for reasoning, correctness, and instruction adherence.",
      "Automated triage for more than 1,000 trajectories, reducing manual review by 42% while improving acceptance consistency.",
    ],
    tags: ["Machine learning", "LLM evaluation", "Data pipelines", "Python"],
  },
  {
    company: "Amazon",
    role: "Software Development Engineer Intern",
    dates: "May 2025 - August 2025",
    location: "Bellevue, WA",
    subtitle: "Agentic incident analysis",
    color: "#f6b436",
    bullets: [
      "Developed an AI-powered platform that automated error-log analysis using LLM agents and a knowledge base.",
      "Centralized service logs in a unified AWS CloudWatch monitoring account to establish reliable automated analysis.",
      "Engineered a multi-agent AWS Bedrock and RAG pipeline for context-aware incident diagnosis from runbooks and documentation.",
      "Operationalized the workflow with Python and AWS Lambda, helping engineers resolve incidents 2.5x faster.",
    ],
    tags: ["AWS Bedrock", "RAG", "Lambda", "CloudWatch"],
  },
  {
    company: "Fidelity Investments",
    role: "Software Engineer Intern",
    dates: "June 2024 - August 2024",
    location: "Durham, NC",
    subtitle: "Associate decision tools",
    color: "#48ad7b",
    bullets: [
      "Created an internal account-analysis experience that cut customer response time by 30%.",
      "Developed responsive Angular and RxJS interfaces that surfaced the right customer information at the right moment.",
      "Engineered a NestJS and GraphQL backend for real-time personalized recommendations.",
    ],
    tags: ["Angular", "RxJS", "NestJS", "GraphQL"],
  },
];

// Kept for the older archived components in this project.
export const experiences = portfolioTracks.map((track) => ({
  title: track.role,
  company: track.company,
  duration: track.dates,
  description: track.subtitle,
  companyUrl: "#experience",
  bgColor: track.color,
}));

export const posts: Array<{
  slug: string;
  title: string;
  date: string;
  content: string;
}> = [];
