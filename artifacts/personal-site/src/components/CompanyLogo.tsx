interface Props {
  bgColor: string;
}

export default function CompanyLogo({ bgColor }: Props) {
  return (
    <div className="flex items-start justify-center w-12 pt-1.5 flex-shrink-0">
      <div
        className="w-4 h-4 rounded-full flex-shrink-0"
        style={{ backgroundColor: bgColor }}
      />
    </div>
  );
}
