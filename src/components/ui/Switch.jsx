import { cn } from "../../lib/utils";

export function Switch({ checked, onCheckedChange, disabled, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        // ✅ UPDATED COLORS FOR BETTER VISIBILITY
        // Active: Green (Universal "ON")
        // Inactive: Darker Slate (Visible against white backgrounds)
        checked ? "bg-green-600" : "bg-slate-300",
        className
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}
