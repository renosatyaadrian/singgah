"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, ExternalLink } from "lucide-react";
import { usePlace } from "@/hooks/usePlaces";
import { useReview } from "@/hooks/useReviews";
import { ReviewCard } from "@/components/review/ReviewCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PlaceCategory } from "@/lib/types";

const categoryConfig: Record<PlaceCategory, { label: string; variant: "food" | "tourist" | "hotel" }> = {
  Food: { label: "Makanan", variant: "food" },
  TouristSpot: { label: "Wisata", variant: "tourist" },
  Hotel: { label: "Hotel", variant: "hotel" },
};

export default function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: place, isLoading: placeLoading } = usePlace(id);
  const { data: review, isLoading: reviewLoading } = useReview(id);

  if (placeLoading) return <div className="animate-pulse h-8 w-48 bg-muted rounded" />;
  if (!place) return <p className="text-muted-foreground">Tempat tidak ditemukan</p>;

  const cat = categoryConfig[place.category];

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/"><ArrowLeft size={16} /></Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">{place.name}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant={cat.variant}>{cat.label}</Badge>
            <a href={place.gmapsUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:underline flex items-center gap-1">
              Google Maps <ExternalLink size={10} />
            </a>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/places/${id}/edit`}><Pencil size={14} /> Edit</Link>
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Review</h2>
          {!review && !reviewLoading && (
            <Button size="sm" asChild>
              <Link href={`/places/${id}/reviews/new`}>Tulis Review</Link>
            </Button>
          )}
        </div>
        {reviewLoading ? (
          <div className="h-32 bg-muted rounded-lg animate-pulse" />
        ) : review ? (
          <ReviewCard review={review} place={place} />
        ) : (
          <p className="text-sm text-muted-foreground">Belum ada review untuk tempat ini.</p>
        )}
      </div>
    </div>
  );
}
