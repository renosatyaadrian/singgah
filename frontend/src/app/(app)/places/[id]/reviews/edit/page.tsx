"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarRatingPicker } from "@/components/review/StarRatingPicker";
import { PhotoUploader } from "@/components/photo/PhotoUploader";
import { useReview, useUpdateReview } from "@/hooks/useReviews";

const schema = z.object({
  rating: z.number().min(1).max(5),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  visitedAt: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: review } = useReview(id);
  const updateReview = useUpdateReview(review?.id ?? "", id);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (review) {
      reset({
        rating: review.rating,
        description: review.description,
        visitedAt: review.visitedAt ?? "",
      });
    }
  }, [review, reset]);

  const onSubmit = async (data: FormData) => {
    await updateReview.mutateAsync({
      rating: data.rating,
      description: data.description,
      visitedAt: data.visitedAt || undefined,
    });
    router.push(`/places/${id}`);
  };

  if (!review) return <div className="h-32 bg-muted animate-pulse rounded-lg" />;

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/places/${id}`}><ArrowLeft size={16} /></Link>
        </Button>
        <h1 className="text-xl font-bold">Edit Review</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Rating</label>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <StarRatingPicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.rating && <p className="text-xs text-destructive">{errors.rating.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Deskripsi</label>
          <Textarea {...register("description")} rows={4} />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Tanggal Kunjungan (opsional)</label>
          <Input type="date" {...register("visitedAt")} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Foto</label>
          <PhotoUploader
            reviewId={review.id}
            placeId={id}
            currentPhoto={review.photo}
          />
        </div>

        <Button type="submit" className="w-full" disabled={updateReview.isPending}>
          {updateReview.isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  );
}
