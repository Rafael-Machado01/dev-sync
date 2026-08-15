import { ComponentProps } from "react";

interface LabelProps extends ComponentProps<"label"> {
  text: string;
}
export default function Label({ text, ...props }: LabelProps) {
  return (
    <label
      className="block mt-2 text-xs text-drac-comment font-bold mb-1.5"
      {...props}
    >
      {text}
    </label>
  );
}
