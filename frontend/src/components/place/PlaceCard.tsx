"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRatingPicker } from "@/components/review/StarRatingPicker";
import { useDeletePlace } from "@/hooks/usePlaces";
import type { Place, PlaceCategory } from "@/lib/types";

const categoryConfig: Record<PlaceCategory, { label: string; variant: "food" | "tourist" | "hotel" }> = {
  Food: { label: "Makanan", variant: "food" },
  TouristSpot: { label: "Wisata", variant: "tourist" },
  Hotel: { label: "Hotel", variant: "hotel" },
};

export function PlaceCard({ place }: { place: Place }) {
  const router = useRouter();
  const deletePlace = useDeletePlace();
  const cat = categoryConfig[place.category];

  const handleDelete = async () => {
    if (!confirm(`Hapus "${place.name}"?`)) return;
    await deletePlace.mutateAsync(place.id);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {place.review?.photo && (
        <div className="relative h-40 w-full bg-gray-100">
          <Image
            src={place.review.photo.s3Url}
            alt={place.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/places/${place.id}`} className="hover:underline">
              <h3 className="font-semibold text-base truncate">{place.name}</h3>
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={cat.variant}>{cat.label}</Badge>
              {place.review && (
                <StarRatingPicker value={place.review.rating} readOnly size="sm" />
              )}
            </div>
            {place.review?.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {place.review.description}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/places/${place.id}/edit`)}
            >
              <Pencil size={15} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deletePlace.isPending}
            >
              <Trash2 size={15} className="text-destructive" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <MapPin size={12} className="text-muted-foreground" />
          <a
            href={place.gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:underline truncate"
          >
            Buka di Google Maps
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
