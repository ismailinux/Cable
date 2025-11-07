import { useInfiniteQuery } from "@tanstack/react-query";
import { tmdbService } from "@/services/tmdb";
import { MovieCard } from "@/components/MovieCard";
import { Navbar } from "@/components/Navbar";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

const Movies = () => {
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["movies-by-date"],
    queryFn: ({ pageParam = 1 }) => tmdbService.getMoviesByReleaseDate(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allMovies = data?.pages.flatMap((page) => page.results) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
            All Movies
          </h1>
          <p className="text-muted-foreground">
            Latest releases sorted by date
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {allMovies.map((movie) => (
                // <MovieCard key={`${movie.id}-${movie.release_date}`} movie={movie} />
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            <div ref={observerTarget} className="flex justify-center py-8">
              {isFetchingNextPage && (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Movies;
