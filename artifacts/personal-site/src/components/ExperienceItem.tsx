import CompanyLogo from "./CompanyLogo";

interface ExperienceItemProps {
  title: string;
  company: string;
  duration: string;
  location: string;
  description: string;
  skills: string[];
  companyUrl: string;
  bgColor: string;
  isLast: boolean;
}

export default function ExperienceItem({
  title,
  company,
  duration,
  location,
  description,
  companyUrl,
  bgColor,
  isLast,
}: ExperienceItemProps) {
  return (
    <div className={`flex gap-4 py-4 ${!isLast ? "border-b border-border" : ""}`}>
      <a href={companyUrl} target="_blank" rel="noopener noreferrer" className="no-underline flex-shrink-0 mt-0.5">
        <CompanyLogo company={company} bgColor={bgColor} />
      </a>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm leading-tight">{title}</p>
        <a
          href={companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm no-underline hover:underline"
        >
          {company}
        </a>
        <p className="text-xs text-muted-foreground mt-0.5">{duration.split(" · ")[0]}</p>
        {description && (
          <p className="text-sm mt-2">{description}</p>
        )}
      </div>
    </div>
  );
}
