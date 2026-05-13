"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreatePlace } from "@/hooks/usePlaces";
import type { PlaceCategory } from "@/lib/types";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  category: z.enum(["Food", "TouristSpot", "Hotel"]),
  gmapsUrl: z.string().url("URL Google Maps tidak valid"),
});

type FormData = z.infer<typeof schema>;

export default function NewPlacePage() {
  const router = useRouter();
  const createPlace = useCreatePlace();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: "Food" },
  });

  const onSubmit = async (data: FormData) => {
    const place = await createPlace.mutateAsync(data);
    router.push(`/places/${place.id}`);
  };

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/"><ArrowLeft size={16} /></Link>
        </Button>
        <h1 className="text-xl font-bold">Tambah Tempat</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Nama Tempat</label>
          <Input {...register("name")} placeholder="Contoh: Sate Pak Kumis" />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Kategori</label>
          <select
            {...register("category")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="Food">🍜 Makanan</option>
            <option value="TouristSpot">🏔️ Wisata</option>
            <option value="Hotel">🏨 Hotel</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Link Google Maps</label>
          <Input {...register("gmapsUrl")} placeholder="https://maps.app.goo.gl/..." />
          {errors.gmapsUrl && <p className="text-xs text-destructive">{errors.gmapsUrl.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={createPlace.isPending}>
          {createPlace.isPending ? "Menyimpan..." : "Simpan Tempat"}
        </Button>
      </form>
    </div>
  );
}
