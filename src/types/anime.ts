export type Anime = {
  mal_id: number;
  url: string;
  images: {
    jpg?: { image_url?: string; small_image_url?: string; large_image_url?: string };
    webp?: { image_url?: string; small_image_url?: string; large_image_url?: string };
  };
  title: string;
  title_english?: string | null;
  synopsis?: string | null;
  type?: string | null;
  episodes?: number | null;
  score?: number | null;
  year?: number | null;
};

export type AnimeSearchResponse = {
  data: Anime[];
  pagination: {
    has_next_page: boolean;
    current_page: number;
    items: { count: number; total: number; per_page: number };
  };
};
