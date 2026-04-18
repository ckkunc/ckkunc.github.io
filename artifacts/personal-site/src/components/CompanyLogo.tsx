interface Props {
  company: string;
  bgColor: string;
  logoSvg?: React.ReactNode;
}

export default function CompanyLogo({ company, bgColor, logoSvg }: Props) {
  const initials = company
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {logoSvg ? (
        <div className="w-8 h-8 flex items-center justify-center text-white">
          {logoSvg}
        </div>
      ) : (
        <span className="text-white font-bold text-sm">{initials}</span>
      )}
    </div>
  );
}
