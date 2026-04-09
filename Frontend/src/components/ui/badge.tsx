import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost';
  className?: string;
  size?: 'xs' | 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  className = "",
  size = 'sm'
}) => {
  const baseStyles = "inline-flex items-center font-bold uppercase tracking-wider rounded-full border";
  
  const sizeStyles = {
    xs: "px-2 py-0.5 text-[9px]",
    sm: "px-2.5 py-1 text-[10px]",
    md: "px-3 py-1.5 text-[11px]"
  };

  const variants = {
    primary: "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/10",
    secondary: "bg-slate-100 text-slate-600 border-slate-200",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    danger: "bg-red-50 text-red-600 border-red-100",
    outline: "bg-transparent text-slate-500 border-slate-200",
    ghost: "bg-slate-50 text-slate-400 border-transparent"
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
