import React from 'react';

interface IconInputProps {
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function IconInput({
  label,
  type,
  placeholder,
  icon,
  value,
  onChange,
}: IconInputProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-neutral">
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          {icon}
        </div>

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full rounded-full border border-primary/20 bg-[#FFF9F8] py-3 pl-10 pr-4 text-sm text-secondary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}