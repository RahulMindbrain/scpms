import React from "react";
import { Sparkles, type LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  icon?: LucideIcon;
  variant?: "indigo" | "sky" | "emerald" | "amber" | "rose" | "cyan";
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  badge,
  icon: Icon,
  variant = "indigo",
  children,
}: PageHeaderProps) {
  const variantMap = {
    indigo: {
      bubblePrimary: "bg-indigo-500",
      bubbleSecondary: "bg-sky-400",
      badgeIcon: "text-indigo-500 dark:text-indigo-400",
      titleSpan: "text-indigo-600 dark:text-indigo-400",
    },
    sky: {
      bubblePrimary: "bg-sky-500",
      bubbleSecondary: "bg-blue-400",
      badgeIcon: "text-sky-500 dark:text-sky-400",
      titleSpan: "text-sky-600 dark:text-sky-400",
    },
    emerald: {
      bubblePrimary: "bg-emerald-500",
      bubbleSecondary: "bg-teal-400",
      badgeIcon: "text-emerald-500 dark:text-emerald-400",
      titleSpan: "text-emerald-600 dark:text-emerald-400",
    },
    amber: {
      bubblePrimary: "bg-amber-500",
      bubbleSecondary: "bg-orange-400",
      badgeIcon: "text-amber-500 dark:text-amber-400",
      titleSpan: "text-amber-600 dark:text-amber-400",
    },
    rose: {
      bubblePrimary: "bg-rose-500",
      bubbleSecondary: "bg-pink-400",
      badgeIcon: "text-rose-500 dark:text-rose-400",
      titleSpan: "text-rose-600 dark:text-rose-400",
    },
    cyan: {
      bubblePrimary: "bg-cyan-500",
      bubbleSecondary: "bg-sky-400",
      badgeIcon: "text-cyan-500 dark:text-cyan-400",
      titleSpan: "text-cyan-600 dark:text-cyan-400",
    },
  };

  const colors = variantMap[variant];

  return (
    <section className="hero-banner relative overflow-visible mb-8" style={{ overflow: "visible" }}>
      <div className="hero-mesh">
        <div className={`absolute top-[-40%] left-[-20%] w-full h-full rounded-full blur-[150px] opacity-20 ${colors.bubblePrimary}`}></div>
        <div className={`absolute bottom-[-40%] right-[-20%] w-full h-full rounded-full blur-[150px] opacity-15 ${colors.bubbleSecondary}`}></div>
      </div>
      <div className="hero-texture"></div>
      <div className="hero-glass-stroke"></div>
      <div className="hero-scanline"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          {badge && (
            <div className="hero-badge">
              <Sparkles className={`h-3.5 w-3.5 ${colors.badgeIcon}`} />
              <span>{badge}</span>
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            {Icon && <Icon className={`h-8 w-8 ${colors.titleSpan}`} />}
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </section>
  );
}
