import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-white">
          {label}
        </label>
      )}

      <input
        className={`
          w-full rounded-lg border bg-[#11131F] px-4 py-3 text-white
          outline-none transition-all duration-200
          placeholder:text-zinc-500
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-zinc-700 focus:border-[#1FD1EB] focus:ring-2 focus:ring-[#1FD1EB]/20"
          }
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
        {...props}
      />

      {error && (
        <span className="text-sm text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}