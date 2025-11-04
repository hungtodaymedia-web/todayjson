
import React from 'react';

interface InfoBoxProps {
  title: string;
  children: React.ReactNode;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, children }) => {
  return (
    <div className="bg-gray-900/80 border-l-4 border-purple-500 p-4 rounded-r-lg mt-4">
      <h3 className="font-semibold text-purple-300 text-sm mb-2">{title}</h3>
      <div className="text-xs text-gray-400 leading-relaxed [&_li]:before:content-['✓_'] [&_li]:before:text-green-400 [&_li]:before:mr-2 [&_li]:pl-1">
          {children}
      </div>
    </div>
  );
};

export default InfoBox;
