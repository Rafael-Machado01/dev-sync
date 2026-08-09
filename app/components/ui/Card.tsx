interface PropsCard {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover }: PropsCard) {
  return (
    <div
      className={`${className} bg-drac-card border-b-drac-purple rounded-2xl transition-all duration-300 ${hover ? "hover:drop-shadow-[0_0_20px_#a855f7]" : ""}`}
    >
      {children}
    </div>
  );
}
