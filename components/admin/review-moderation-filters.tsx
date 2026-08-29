import Link from "next/link";

import type {
  ModerationFilter,
} from "@/types/moderation.types";

interface ReviewModerationFiltersProps {
  activeFilter: ModerationFilter;
  counts?: Partial<
    Record<ModerationFilter, number>
  >;
}

const filters: {
  value: ModerationFilter;
  label: string;
}[] = [
  { value: "ALL", label: "Todas" },
  { value: "PENDING", label: "Pendientes" },
  { value: "APPROVED", label: "Aprobadas" },
  { value: "REJECTED", label: "Rechazadas" },
];

export default function ReviewModerationFilters({
  activeFilter,
  counts = {},
}: ReviewModerationFiltersProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-2 rounded-xl border border-[#2E334A] bg-[#1A1C2B] p-2">
        {filters.map((filter) => {
          const isActive =
            activeFilter === filter.value;

          const count = counts[filter.value];

          const href =
            filter.value === "ALL"
              ? "/admin/reviews"
              : `/admin/reviews?status=${filter.value}`;

          return (
            <Link
              key={filter.value}
              href={href}
              className={[
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
                isActive
                  ? "bg-[#783DF2] text-white shadow-[0_0_18px_rgba(120,61,242,0.25)]"
                  : "text-[#949CB2] hover:bg-[#25283A] hover:text-white",
              ].join(" ")}
            >
              <span>{filter.label}</span>

              {typeof count === "number" && (
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-xs",
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-[#090B14] text-[#949CB2]",
                  ].join(" ")}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
