
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 text-center">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="text-2xl font-bold text-purple-400">{value}</div>
    </div>
  );
};

export default StatCard;
