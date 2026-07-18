import { cn } from "@/lib/utils";

export function WeipMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" />
        <path
          d="M12 1.5V22.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
      <span className="font-display text-lg tracking-tight">WEIP</span>
    </div>
  );
}
