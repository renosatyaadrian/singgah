"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { PlaceCategory } from "@/lib/types";

const FILTERS: { label: string; value: PlaceCategory | "All" }[] = [
  { label: "Semua", value: "All" },
  { label: "🍜 Makanan", value: "Food" },
  { label: "🏔️ Wisata", value: "TouristSpot" },
  { label: "🏨 Hotel", value: "Hotel" },
];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "All";

  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All") params.delete("category");
    else params.set("category", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => handleFilter(value)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
            active === value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background border-border hover:bg-accent"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
