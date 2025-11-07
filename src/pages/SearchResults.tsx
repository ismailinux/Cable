import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { tmdbService } from "@/services/tmdb";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => tmdbService.searchMovies(query),
    enabled: !!query,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Search Results</h1>
            <p className="text-muted-foreground">
              {query && `Showing results for "${query}"`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="cinema-card animate-pulse">
                <div className="aspect-[2/3] bg-muted" />
                <div className="p-4">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : data && data.results.length > 0 ? (
          <>
            <p className="text-muted-foreground mb-6">
              Found {data.total_results.toLocaleString()} results
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {data.results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              No results found for "{query}"
            </p>
            <Button asChild className="mt-4">
              <Link to="/">Go back home</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
