
import React from 'react';

interface ControlInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const ControlInput: React.FC<ControlInputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-purple-300 mb-1">{label}</label>
      <input
        id={id}
        {...props}
        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500 transition"
      />
    </div>
  );
};

export default ControlInput;
