import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Review, CreateReviewRequest } from "@/lib/types";

export function useReview(placeId: string) {
  return useQuery<Review>({
    queryKey: ["reviews", placeId],
    queryFn: async () => {
      const { data } = await api.get(`/api/places/${placeId}/reviews`);
      return data;
    },
    enabled: !!placeId,
    retry: false,
  });
}

export function useCreateReview(placeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateReviewRequest) =>
      api.post(`/api/places/${placeId}/reviews`, req).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", placeId] });
      qc.invalidateQueries({ queryKey: ["places"] });
    },
  });
}

export function useUpdateReview(reviewId: string, placeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateReviewRequest) =>
      api.put(`/api/reviews/${reviewId}`, req).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", placeId] });
      qc.invalidateQueries({ queryKey: ["places"] });
    },
  });
}

export function useDeleteReview(placeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => api.delete(`/api/reviews/${reviewId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", placeId] });
      qc.invalidateQueries({ queryKey: ["places"] });
    },
  });
}
