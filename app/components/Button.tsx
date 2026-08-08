import type { ButtonHTMLAttributes, ComponentType, SVGProps } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export default function Button({
  icon: Icon,
  children,
  onClick,
  className,
  type,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={` ${className} flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-medium
        transition-all duration-300 cursor-pointer`}
    >
      {Icon} {children}
    </button>
  );
}
