export type TMDbMovie = {
  id: number;
  title: string;
  overview?: string | null;
  poster_path?: string | null;
  vote_average: number;
  release_date?: string | null;
};

export type TMDbSearchResponse = {
  results: TMDbMovie[];
};

export type TMDbResponse = {
  page: number;
  results: TMDbMovie[];
  total_pages: number;
  total_results?: number;
};


export type TMDbBrowseKind = "popular" | "top_rated" | "upcoming" | "now_playing";