import { tailwindData } from "@/app/constants/tailwindData";
import { ComponentProps } from "react";

interface InputProps extends ComponentProps<"input"> {
  placeholder?: string;
}

export default function Input({ placeholder, ...props }: InputProps) {
  return (
    <input
      className={tailwindData.input}
      placeholder={placeholder}
      {...props}
    />
  );
}
