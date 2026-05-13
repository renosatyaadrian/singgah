"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import { Button } from "@/components/ui/button";
import { useUploadPhoto, useDeletePhoto } from "@/hooks/usePhotos";
import type { Photo } from "@/lib/types";

interface PhotoUploaderProps {
  reviewId: string;
  placeId: string;
  currentPhoto?: Photo;
}

export function PhotoUploader({ reviewId, placeId, currentPhoto }: PhotoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentPhoto?.s3Url ?? null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadPhoto = useUploadPhoto(placeId);
  const deletePhoto = useDeletePhoto(placeId);

  const handleFile = async (file: File) => {
    let toUpload = file;
    if (file.size > 500 * 1024) {
      toUpload = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
    }

    const objectUrl = URL.createObjectURL(toUpload);
    setPreview(objectUrl);

    await uploadPhoto.mutateAsync({ reviewId, file: toUpload });
  };

  const handleDelete = async () => {
    if (!currentPhoto) return;
    await deletePhoto.mutateAsync(currentPhoto.id);
    setPreview(null);
  };

  const isLoading = uploadPhoto.isPending || deletePhoto.isPending;

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative rounded-md overflow-hidden h-52 bg-gray-100">
          <Image src={preview} alt="Upload preview" fill className="object-cover" sizes="100vw" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-md hover:border-primary transition-colors text-muted-foreground hover:text-primary"
        >
          {isLoading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <>
              <Upload size={24} />
              <span className="text-sm mt-1">Upload foto (max 500KB, auto-compress)</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
