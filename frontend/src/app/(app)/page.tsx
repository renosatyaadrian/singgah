"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePlaces } from "@/hooks/usePlaces";
import { PlaceCard } from "@/components/place/PlaceCard";
import { CategoryFilter } from "@/components/place/CategoryFilter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PlaceCategory } from "@/lib/types";
import { useState } from "react";

function Dashboard() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const category = searchParams.get("category") as PlaceCategory | undefined;

  const { data, isLoading } = usePlaces({ category, search: search || undefined });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tempat Kamu</h1>
        <Button asChild size="sm">
          <Link href="/places/new">
            <Plus size={16} /> Tambah
          </Link>
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari tempat..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <CategoryFilter />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : data?.items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">Belum ada tempat</p>
          <p className="text-sm mt-1">Mulai dengan menambahkan tempat yang kamu kunjungi</p>
          <Button asChild className="mt-4">
            <Link href="/places/new">Tambah Tempat Pertama</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.items.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
}
