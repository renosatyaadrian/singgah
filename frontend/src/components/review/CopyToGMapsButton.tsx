"use client";

import { useState } from "react";
import { ClipboardCopy, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Review, Place } from "@/lib/types";

interface CopyToGMapsButtonProps {
  review: Review;
  place: Place;
}

export function CopyToGMapsButton({ review, place }: CopyToGMapsButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const visited = review.visitedAt
      ? new Date(review.visitedAt).toLocaleDateString("id-ID", {
          day: "numeric", month: "long", year: "numeric",
        })
      : null;

    const text = [
      review.description,
      "",
      `Rating: ${"⭐".repeat(review.rating)}${review.rating}/5`,
      visited ? `Dikunjungi: ${visited}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    window.open(place.gmapsUrl, "_blank");
  };

  return (
    <Button variant="outline" size="sm" onClick={handleClick} className="gap-2">
      {copied ? <Check size={14} className="text-green-600" /> : <ClipboardCopy size={14} />}
      {copied ? "Disalin!" : "Copy & Buka GMaps"}
      <ExternalLink size={12} className="text-muted-foreground" />
    </Button>
  );
}
