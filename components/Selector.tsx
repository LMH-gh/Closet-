import React from 'react';
import type { SelectorOption } from '../types';

interface SelectorProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectorOption[];
}

const Selector: React.FC<SelectorProps> = ({ label, value, onChange, options }) => {
  return (
    <div>
      <label htmlFor={label} className="block text-sm font-semibold text-slate-600 mb-2">
        {label}
      </label>
      <select
        id={label}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 focus:border-transparent transition duration-300 ease-in-out"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Selector;