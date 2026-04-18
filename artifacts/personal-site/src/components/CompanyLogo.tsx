interface Props {
  company: string;
  bgColor: string;
}

export default function CompanyLogo({ company, bgColor }: Props) {
  const initial = company[0].toUpperCase();

  return (
    <div
      className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: bgColor }}
    >
      <span className="text-white font-bold text-lg">{initial}</span>
    </div>
  );
}
