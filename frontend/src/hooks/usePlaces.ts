import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Place, PagedResult, CreatePlaceRequest, PlaceCategory } from "@/lib/types";

interface PlacesParams {
  category?: PlaceCategory;
  search?: string;
  page?: number;
  pageSize?: number;
}

export function usePlaces(params: PlacesParams = {}) {
  return useQuery<PagedResult<Place>>({
    queryKey: ["places", params],
    queryFn: async () => {
      const { data } = await api.get("/api/places", { params });
      return data;
    },
  });
}

export function usePlace(id: string) {
  return useQuery<Place>({
    queryKey: ["places", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/places/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePlace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: CreatePlaceRequest) => api.post("/api/places", req).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["places"] }),
  });
}

export function useUpdatePlace(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: CreatePlaceRequest) => api.put(`/api/places/${id}`, req).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["places"] });
      qc.invalidateQueries({ queryKey: ["places", id] });
    },
  });
}

export function useDeletePlace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/places/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["places"] }),
  });
}
