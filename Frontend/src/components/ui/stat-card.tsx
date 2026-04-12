import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon?: LucideIcon;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  className,
}) => {
  return (
    <div className={cn(
      "bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:shadow-2xl transition-all duration-300",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-7 h-7" />
          </div>
        )}
        {subtext && (
          <div className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
            {subtext}
          </div>
        )}
      </div>
      <div>
        <div className="text-4xl font-black text-slate-900 mb-1 tracking-tight">
          {value}
        </div>
        <div className="text-slate-400 text-xs font-bold uppercase tracking-[0.1em]">
          {label}
        </div>
      </div>
    </div>
  );
};
