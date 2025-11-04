
import React from 'react';

interface PanelProps {
  title: string;
  children: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-700 h-full">
      <h2 className="text-xl font-bold text-purple-300 border-b border-gray-700 pb-2 flex items-center gap-2">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default Panel;
