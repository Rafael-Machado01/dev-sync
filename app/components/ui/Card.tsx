interface PropsCard {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}
export default function Card({
  children,
  className,
  hover = false,
}: PropsCard) {
  return (
    <div
      className={`
        bg-drac-card
        border border-drac-purple/25
        rounded-2xl
        shadow-2xl
        transition-all duration-300
        ${hover ? "hover:shadow-glow-purple" : ""}
        ${className ?? ""}
      `}
    >
      {children}
    </div>
  );
}
