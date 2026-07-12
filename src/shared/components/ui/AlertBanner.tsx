import React from "react";

type Variant = "error" | "warning";

const variantClasses: Record<Variant, string> = {
  error: "border-red-200 bg-red-50 text-red-700",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
};

interface AlertBannerProps {
  variant?: Variant;
  children: React.ReactNode;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  variant = "error",
  children,
}) => (
  <div className={`mb-6 rounded-3xl border p-4 text-sm ${variantClasses[variant]}`}>
    {children}
  </div>
);
