import React from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  actions,
}) => (
  <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#A3513D]">
          {eyebrow}
        </p>
      )}
      <h1 className="text-4xl font-extrabold text-[#3B241C]">{title}</h1>
      {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
    </div>
    {actions && <div className="flex gap-3">{actions}</div>}
  </header>
);
