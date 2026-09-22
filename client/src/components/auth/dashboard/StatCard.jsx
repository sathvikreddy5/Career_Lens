const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  accent = "indigo",
}) => {
  const accents = {
    indigo: {
      bg: "bg-[#EEF2FF]",
      text: "text-[#4F46E5]",
    },
    green: {
      bg: "bg-[#ECFDF3]",
      text: "text-[#16A34A]",
    },
    orange: {
      bg: "bg-[#FFF7ED]",
      text: "text-[#D97706]",
    },
  };

  const style = accents[accent] || accents.indigo;

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] font-medium text-[#6B7280]">{title}</p>

          <h3 className="mt-2 text-[27px] font-semibold tracking-tight text-[#111]">
            {value}
          </h3>

          <p className="mt-1 text-[11px] text-[#9CA3AF]">{description}</p>
        </div>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${style.bg} ${style.text}`}
        >
          <Icon size={18} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
