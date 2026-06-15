import React from 'react';

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function SelectField({ label, value, options, error, onChange }: SelectFieldProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-bold text-secondary mb-2">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className={`p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
      >
        <option value="">Selecciona...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-red-500 text-xs mt-1 font-semibold">{error}</span>}
    </div>
  );
}