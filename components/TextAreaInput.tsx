
import React from 'react';

interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id: string;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ label, id, className, ...props }) => {
  const baseClasses = "w-full p-3 border border-gray-600 rounded-lg font-mono text-xs resize-y bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 text-gray-200 placeholder-gray-500";
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-semibold text-purple-300 mb-2">{label}</label>}
      <textarea id={id} className={`${baseClasses} ${className}`} {...props} />
    </div>
  );
};

export default TextAreaInput;
