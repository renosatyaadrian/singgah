"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingPickerProps {
  value: number;
  onChange?: (val: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md";
}

export function StarRatingPicker({ value, onChange, readOnly, size = "md" }: StarRatingPickerProps) {
  const starSize = size === "sm" ? 14 : 20;

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={cn("transition-colors", readOnly ? "cursor-default" : "hover:scale-110")}
        >
          <Star
            size={starSize}
            className={cn(star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300")}
          />
        </button>
      ))}
    </div>
  );
}
