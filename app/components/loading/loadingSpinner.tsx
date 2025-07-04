// components/LoadingSpinner.tsx
import React from "react";

interface LoadingSpinnerProps {
  size?: number; // optional, default size
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 48 }) => {
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div
        className="loader-circle"
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
