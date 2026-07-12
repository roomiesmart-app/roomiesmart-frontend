import React from "react";

type Tone = "default" | "danger" | "success" | "brand";

interface StatCardProps {
  label: string;
  value: string;
  tone?: Tone;
}

const valueColor: Record<Exclude<Tone, "brand">, string> = {
  default: "text-gray-900",
  danger: "text-[#DC2626]",
  success: "text-[#059669]",
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  tone = "default",
}) => {
  if (tone === "brand") {
    return (
      <div className="bg-[#8C3A27] p-6 rounded-[2rem] shadow-md flex flex-col justify-center">
        <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
          {label}
        </p>
        <h3 className="text-4xl font-extrabold text-white mb-1">{value}</h3>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#F2E3DB] flex flex-col justify-center">
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
        {label}
      </p>
      <h3 className={`text-3xl font-extrabold mb-1 ${valueColor[tone]}`}>
        {value}
      </h3>
    </div>
  );
};
