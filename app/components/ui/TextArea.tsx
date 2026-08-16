import { tailwindData } from "@/app/constants/tailwindData";
import { ComponentProps } from "react";

interface InputProps extends ComponentProps<"textarea"> {
  placeholder?: string;
}

export default function TextArea({ placeholder, ...props }: InputProps) {
  return (
    <textarea
      className={` ${tailwindData.input} resize-none shadow-lg `}
      placeholder={placeholder}
      {...props}
    ></textarea>
  );
}
