import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
}

export default function Badge({
  children,
  variant = "primary",
  className = "",
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

  const variants = {
    primary:
      "bg-[#783DF2]/20 text-[#A879FF] border border-[#783DF2]/40",

    secondary:
      "bg-[#1FD1EB]/10 text-[#1FD1EB] border border-[#1FD1EB]/40",

    success:
      "bg-green-500/10 text-green-400 border border-green-500/30",

    warning:
      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",

    danger:
      "bg-red-500/10 text-red-400 border border-red-500/30",
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}