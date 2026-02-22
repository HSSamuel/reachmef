import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-6 md:p-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
