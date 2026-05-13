import React from "react";
import { cn } from "@/lib/utils";

interface StudentPageLayoutProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function StudentPageLayout({ 
  children, 
  className = "", 
  containerClassName = "" 
}: StudentPageLayoutProps) {
  return (
    <div className={cn("flex-1 flex flex-col bg-background min-h-0", className)}>
      <div className={cn(
        "max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-10 space-y-8 animate-in fade-in duration-700",
        containerClassName
      )}>
        {children}
      </div>
    </div>
  );
}

export default StudentPageLayout;
