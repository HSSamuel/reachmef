import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Input = forwardRef(({ className, error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <input
        ref={ref}
        className={cn(
          "w-full h-12 px-4 rounded-xl border bg-white text-slate-900 transition-all duration-200 outline-none placeholder:text-slate-400",
          "border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
          className
        )}
        {...props}
      />
      {error && (
        <span className="absolute -bottom-5 left-1 text-xs font-medium text-red-500">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = "Input";
