export default function SyncLogo({ size = 34 }: { size?: number }) {
  return (
    <div className={` flex items-center justify-center gap-2.5`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 34 34"
        fill="none"
        className="text-drac-purple"
      >
        <circle
          cx="17"
          cy="17"
          r="16"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />

        <circle
          cx="13"
          cy="17"
          r="7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeOpacity="0.55"
        />

        <circle
          cx="21"
          cy="17"
          r="7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeOpacity="0.55"
        />

        <path
          d="M17 10.5 C19.5 12.3 20.6 14.6 20.6 17 C20.6 19.4 19.5 21.7 17 23.5 C14.5 21.7 13.4 19.4 13.4 17 C13.4 14.6 14.5 12.3 17 10.5Z"
          fill="currentColor"
          opacity="0.2"
        />

        <circle cx="17" cy="10" r="2" fill="currentColor" />

        <circle cx="17" cy="24" r="2" fill="currentColor" opacity="0.4" />

        <line
          x1="17"
          y1="14"
          x2="17"
          y2="20"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
      </svg>

      <span
        className="font-extrabold text-drac-fg tracking-[-0.04em]"
        style={{
          fontSize: size * 0.75,
          textShadow: "0 0 24px rgb(189 147 249 / 0.4)",
          animation: "float 6s ease-in-out infinite",
        }}
      >
        sync<span className="text-drac-purple">.</span>
      </span>
    </div>
  );
}
