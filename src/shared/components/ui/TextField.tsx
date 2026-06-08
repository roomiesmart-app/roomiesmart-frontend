import React from 'react';

interface TextFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string | number;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TextField({ label, type = 'text', placeholder, value, error, onChange }: TextFieldProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-bold text-secondary mb-2">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
      />
      {error && <span className="text-red-500 text-xs mt-1 font-semibold">{error}</span>}
    </div>
  );
}