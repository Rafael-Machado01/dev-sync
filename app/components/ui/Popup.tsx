import { useEffect, useState } from "react";

interface PopupProps {
  message: string;
  type: "success" | "error";
}
export default function Popup({ message, type }: PopupProps) {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  });
  if (!isVisible) return null;
  return (
    <div
      className={`fixed top-20 right-6 p-4 bg-drac-card  rounded-md z-200
        ${type === "success" ? "text-drac-green shadow-glow-purple" : "text-drac-red shadow-glow-red"}`}
    >
      <p>{message}</p>
    </div>
  );
}
