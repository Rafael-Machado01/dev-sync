interface ModalProps {
  className?: string;
  isOpen: boolean;
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}

export default function Modal({
  className,
  children,
  title,
  isOpen,
  onClose,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/78 backdrop-blur-md p-5"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-125 max-h-[90vh] flex flex-col overflow-hidden rounded-[20px] bg-drac-card border border-drac-purple/25 shadow-glow-purple-lg ${className ?? ""}`}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4.5 border-b border-drac-line/33">
          <span className="text-xs text-drac-fg">{title}</span>
          <button
            onClick={onClose}
            className="px-1 text-lg leading-none text-drac-comment hover:text-drac-fg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
