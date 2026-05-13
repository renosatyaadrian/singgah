"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarRatingPicker } from "./StarRatingPicker";
import { CopyToGMapsButton } from "./CopyToGMapsButton";
import { useDeleteReview } from "@/hooks/useReviews";
import type { Review, Place } from "@/lib/types";

interface ReviewCardProps {
  review: Review;
  place: Place;
}

export function ReviewCard({ review, place }: ReviewCardProps) {
  const deleteReview = useDeleteReview(place.id);

  const handleDelete = async () => {
    if (!confirm("Hapus review ini?")) return;
    await deleteReview.mutateAsync(review.id);
  };

  const formattedDate = review.visitedAt
    ? new Date(review.visitedAt).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <StarRatingPicker value={review.rating} readOnly />
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/places/${place.id}/reviews/edit`}>
                <Pencil size={15} />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deleteReview.isPending}
            >
              <Trash2 size={15} className="text-destructive" />
            </Button>
          </div>
        </div>

        {review.photo && (
          <div className="relative h-52 w-full rounded-md overflow-hidden bg-gray-100">
            <Image
              src={review.photo.s3Url}
              alt="Review photo"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        <p className="text-sm">{review.description}</p>

        {formattedDate && (
          <p className="text-xs text-muted-foreground">📅 Dikunjungi: {formattedDate}</p>
        )}

        <CopyToGMapsButton review={review} place={place} />
      </CardContent>
    </Card>
  );
}
