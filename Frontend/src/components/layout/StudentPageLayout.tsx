import React from "react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/reducers/rootReducer";
import WarningBanner from "../WarningBanner";

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
  const { user } = useSelector((state: RootState) => state.auth);
  const isStudent = user?.role === "STUDENT";
  const isApproved = user?.status === "ACTIVE";

  return (
    <div className={cn("flex-1 flex flex-col bg-background min-h-0", className)}>
      <div className={cn(
        "max-w-[1440px] w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-700",
        containerClassName
      )}>
        {isStudent && (
          <WarningBanner 
            isVisible={!isApproved} 
            message="Your account is not approved yet. Please contact your placement cell or wait for approval."
          />
        )}
        {children}
      </div>
    </div>
  );
}

export default StudentPageLayout;
