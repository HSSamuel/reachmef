import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react"; // Install icons if missing: npm i lucide-react

export const Button = forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        "bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/20 border-transparent",
      secondary:
        "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm border",
      ghost:
        "bg-transparent text-slate-600 hover:bg-slate-100 border-transparent",
      danger: "bg-red-50 text-red-600 hover:bg-red-100 border-transparent",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-6 text-sm",
      lg: "h-14 px-8 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
