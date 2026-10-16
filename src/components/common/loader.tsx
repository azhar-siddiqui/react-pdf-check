import React from "react";

interface LoaderProps {
  /** Size variants for the loader */
  size?: "sm" | "md" | "lg" | "xl";
  /** Tailwind text color class for the outer tracks (e.g., 'text-blue-600') */
  color?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  color = "text-blue-600",
}) => {
  // Map size prop to Tailwind width and height utilities
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
    xl: "h-16 w-16 border-4",
  };

  return (
    <div
      className="flex items-center justify-center"
      role="status"
      aria-label="loading"
    >
      <div
        className={`
          ${sizeClasses[size]} 
          ${color} 
          animate-spin 
          rounded-full 
          border-solid 
          border-current 
          border-t-transparent
        `}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
