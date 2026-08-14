import { ComponentProps } from "react";

interface InputProps extends ComponentProps<"input"> {
  placeholder?: string;
}

export default function Input({ placeholder, ...props }: InputProps) {
  return (
    <input
      className="w-full bg-drac-surface border border-drac-line rounded-md py-2.5 px-3 text-drac-fg text-sm box-border outline-none focus:border-drac-purple transition-all duration-200"
      placeholder={placeholder}
      {...props}
    />
  );
}
