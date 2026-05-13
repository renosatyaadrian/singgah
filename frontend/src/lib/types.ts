export type PlaceCategory = "Food" | "TouristSpot" | "Hotel";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface Photo {
  id: string;
  s3Url: string;
  orderIndex: number;
}

export interface ReviewSummary {
  id: string;
  rating: number;
  description: string;
  visitedAt?: string;
  photo?: Photo;
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  gmapsUrl: string;
  createdAt: string;
  updatedAt: string;
  review?: ReviewSummary;
}

export interface Review {
  id: string;
  placeId: string;
  rating: number;
  description: string;
  visitedAt?: string;
  createdAt: string;
  updatedAt: string;
  photo?: Photo;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface CreatePlaceRequest {
  name: string;
  category: PlaceCategory;
  gmapsUrl: string;
}

export interface CreateReviewRequest {
  rating: number;
  description: string;
  visitedAt?: string;
}
