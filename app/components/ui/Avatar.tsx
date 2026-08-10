import Image from "next/image";

interface AvatarProps {
  src: string;
  alt: string;
  size: number;
  ring: boolean;
}

export default function Avatar({ src, alt, size, ring }: AvatarProps) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {ring && (
        <div className="absolute -inset-0.75 rounded-full border-[1.5px] border-drac-purple shadow-glow-purple" />
      )}
      <Image
        width={size}
        height={size}
        src={src}
        alt={alt}
        className={`rounded-full object-cover block ${
          ring
            ? "border-[1.5px] border-drac-purple"
            : "border-[1.5px] border-drac-line"
        }`}
      />
    </div>
  );
}
