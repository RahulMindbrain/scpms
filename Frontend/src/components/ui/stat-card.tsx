import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: string;
  trendColor?: string;
  subtext?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  trendColor = "text-emerald-500", 
  subtext,
  className = "" 
}) => {
  return (
    <div className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group ${className}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
            {trend && (
              <span className={`text-xs font-bold ${trendColor} bg-opacity-10 py-1 rounded-lg flex items-center gap-1`}>
                {trend}
              </span>
            )}
          </div>
          {subtext && <p className="text-xs text-slate-400 font-medium">{subtext}</p>}
        </div>
        {Icon && (
          <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <Icon className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
          </div>
        )}
      </div>
    </div>
  );
};
