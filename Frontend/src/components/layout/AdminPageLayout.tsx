import React from "react";

interface AdminPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminPageLayout({ children, className = "" }: AdminPageLayoutProps) {
  return (
    <div className={`flex-1 flex flex-col bg-background min-h-0 ${className}`}>
      <div className="max-w-[1600px] w-full mx-auto p-4 md:p-8 lg:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {children}
      </div>
    </div>
  );
}
