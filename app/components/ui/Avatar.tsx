import Image from "next/image";

interface AvatarProps {
  src: string;
  alt: string;
  size: number;
  ring?: boolean;
  className?: string;
}

export default function Avatar({
  src,
  alt,
  size,
  ring,
  className,
}: AvatarProps) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {ring && (
        <div className="absolute  -inset-0.75 rounded-full border-[1.5px] border-drac-purple shadow-glow-purple" />
      )}
      <Image
        width={size}
        height={size}
        src={src}
        alt={alt}
        className={` ${className} rounded-full object-cover shadow-glow-purple w-[${size}] h-[${size}] block `}
      />
    </div>
  );
}
