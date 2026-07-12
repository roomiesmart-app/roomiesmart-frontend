import React from "react";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  children,
}) => (
  <div className="rounded-[32px] border border-[#F1DED6] bg-white p-12 text-center">
    <p className="mb-2 text-lg font-bold text-[#3B241C]">{title}</p>
    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    {children && <div className="mt-6">{children}</div>}
  </div>
);
