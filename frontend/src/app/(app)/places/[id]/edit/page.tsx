"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlace, useUpdatePlace } from "@/hooks/usePlaces";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  category: z.enum(["Food", "TouristSpot", "Hotel"]),
  gmapsUrl: z.string().url("URL Google Maps tidak valid"),
});

type FormData = z.infer<typeof schema>;

export default function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: place } = usePlace(id);
  const updatePlace = useUpdatePlace(id);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (place) reset({ name: place.name, category: place.category, gmapsUrl: place.gmapsUrl });
  }, [place, reset]);

  const onSubmit = async (data: FormData) => {
    await updatePlace.mutateAsync(data);
    router.push(`/places/${id}`);
  };

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/places/${id}`}><ArrowLeft size={16} /></Link>
        </Button>
        <h1 className="text-xl font-bold">Edit Tempat</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Nama Tempat</label>
          <Input {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Kategori</label>
          <select {...register("category")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="Food">🍜 Makanan</option>
            <option value="TouristSpot">🏔️ Wisata</option>
            <option value="Hotel">🏨 Hotel</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Link Google Maps</label>
          <Input {...register("gmapsUrl")} />
          {errors.gmapsUrl && <p className="text-xs text-destructive">{errors.gmapsUrl.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={updatePlace.isPending}>
          {updatePlace.isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  );
}
