import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "custom"; // Add 'custom' to bypass defaults
  textColor?: string;
}

export const Button: React.FC<ButtonProps> = ({
  className = "",
  variant = "primary",
  textColor = "",
  children,
  ...props
}) => {
  const baseClasses = "px-4 py-2 rounded-xl transition font-bold";

  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-400 text-black hover:bg-gray-500",
    danger: "bg-red-500 text-white hover:bg-red-600",
    custom: "", // No default styles, fully custom
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${textColor}`}
      {...props}
    >
      {children}
    </button>
  );
};
