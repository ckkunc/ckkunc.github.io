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
    <div className={`group flex gap-4 py-4 px-2 -mx-2 rounded-md transition-all duration-150 cursor-default ${!isLast ? "border-b border-border" : ""} hover:bg-black/[0.05] hover:border-transparent`}>
      <a href={companyUrl} target="_blank" rel="noopener noreferrer" className="no-underline flex-shrink-0 mt-0.5">
        <CompanyLogo bgColor={bgColor} />
      </a>
      <div className="flex-1 min-w-0 transition-transform duration-150 origin-left group-hover:scale-[1.03]">
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
          <p className="text-sm mt-2" dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </div>
    </div>
  );
}
