import React from "react";

interface LoaderProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ fullScreen = false, size = "md", text }) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-3",
    lg: "h-16 w-16 border-4",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
    : "flex flex-col items-center justify-center p-8 w-full h-full min-h-[200px]";

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Outer Ring */}
        <div
          className={`${sizeClasses[size]} rounded-full border-slate-200 animate-pulse`}
        ></div>
        
        {/* Spinning Ring */}
        <div
          className={`absolute top-0 left-0 ${sizeClasses[size]} rounded-full border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent animate-spin`}
        ></div>

        {/* Inner Glow */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
            size === "sm" ? "h-2 w-2" : size === "md" ? "h-4 w-4" : "h-6 w-6"
          } bg-indigo-600/20 rounded-full blur-sm animate-pulse`}
        ></div>
      </div>
      
      {text && (
        <p className="mt-4 text-sm font-medium text-slate-600 animate-pulse tracking-wide">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
