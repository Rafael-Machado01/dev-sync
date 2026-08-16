import { ComponentProps } from "react";

interface LabelProps extends ComponentProps<"label"> {
  text: string;
  className?: string;
  children?: React.ReactNode;
}
export default function Label({
  text,
  className,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={`block mt-2 text-xs text-drac-comment font-bold mb-1.5 ${className}`}
      {...props}
    >
      {text}
      {children}
    </label>
  );
}
