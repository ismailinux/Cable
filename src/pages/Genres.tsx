// src/pages/Genres.tsx
import { useState, useEffect, useRef } from "react";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { tmdbService } from "@/services/tmdb";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Film, Loader2 } from "lucide-react";

const Genres = () => {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Load genres
  const { data: genresData } = useQuery({
    queryKey: ["genres"],
    queryFn: () => tmdbService.getGenres(),
  });

  // Reset query cache when genre changes
  useEffect(() => {
    if (selectedGenre) {
      queryClient.resetQueries({
        queryKey: ["genre-movies", selectedGenre],
      });
    }
  }, [selectedGenre, queryClient]);

  // Infinite query for movies by genre
  const {
    data: moviesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: moviesLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["genre-movies", selectedGenre],
    queryFn: ({ pageParam = 1 }) =>
      tmdbService.getMoviesByGenre(selectedGenre!, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: !!selectedGenre,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Deduplicate movies by ID
  const allMovies = (() => {
    const map = new Map<number, any>();
    moviesData?.pages.forEach((page) => {
      page.results.forEach((movie: any) => {
        if (!map.has(movie.id)) {
          map.set(movie.id, movie);
        }
      });
    });
    return Array.from(map.values());
  })();

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const current = observerTarget.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse by Genre</h1>
          <p className="text-muted-foreground">
            Discover movies by category
          </p>
        </div>

        {/* Genre Chips */}
        <div className="flex flex-wrap gap-3 mb-8">
          {genresData?.genres.map((genre) => (
            <Button
              key={genre.id}
              variant={selectedGenre === genre.id ? "default" : "outline"}
              onClick={() => setSelectedGenre(genre.id)}
              className={
                selectedGenre === genre.id
                  ? "cinema-button"
                  : "border-border hover:border-primary"
              }
            >
              {genre.name}
            </Button>
          ))}
        </div>

        {/* Content */}
        {selectedGenre ? (
          moviesLoading && !isFetchingNextPage ? (
            // Skeleton loader on first load
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="cinema-card animate-pulse">
                  <div className="aspect-[2/3] bg-muted rounded-lg" />
                  <div className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Movies Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {allMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              {/* Infinite Scroll Trigger + Loader */}
              <div
                ref={observerTarget}
                className="flex justify-center py-8"
              >
                {isFetchingNextPage && (
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                )}
              </div>

              {/* Optional: End of results */}
              {!hasNextPage && allMovies.length > 0 && (
                <p className="text-center text-muted-foreground py-8">
                  You've reached the end!
                </p>
              )}
            </>
          )
        ) : (
          // No genre selected
          <div className="text-center py-16">
            <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">
              Select a genre to start browsing
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Genres;