import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type,
  disabled,
  className,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${className} ${disabled ? "cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
};

export default Button;
