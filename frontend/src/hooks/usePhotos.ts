import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Photo } from "@/lib/types";

export function useUploadPhoto(placeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, file }: { reviewId: string; file: File }) => {
      const { data: presigned } = await api.post("/api/photos/presigned-url", { reviewId });
      await fetch(presigned.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": "image/jpeg" },
      });
      const { data: photo } = await api.post<Photo>("/api/photos/confirm", {
        reviewId,
        s3Key: presigned.s3Key,
        s3Url: presigned.uploadUrl.split("?")[0],
      });
      return photo;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", placeId] });
      qc.invalidateQueries({ queryKey: ["places"] });
    },
  });
}

export function useDeletePhoto(placeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (photoId: string) => api.delete(`/api/photos/${photoId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", placeId] });
      qc.invalidateQueries({ queryKey: ["places"] });
    },
  });
}
