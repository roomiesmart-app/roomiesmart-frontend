import React from 'react';

export interface TextFieldProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  disabled?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-secondary">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 focus:bg-white transition-all outline-none
          ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-100' : ''}
          ${error ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'}
        `}
      />
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
};