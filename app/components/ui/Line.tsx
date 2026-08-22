interface LineProps {
  className?: string;
}
export default function Line({ className }: LineProps) {
  return (
    <div
      className={`
        ${className} flex-1 h-px bg-linear-to-r from-drac-line/40 to-transparent`}
    />
  );
}
