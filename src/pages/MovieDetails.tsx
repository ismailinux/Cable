import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { tmdbService, MovieDetails as MovieDetailsType } from "@/services/tmdb";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Clock, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const MovieDetails = () => {
  const { id } = useParams();
  const movieId = parseInt(id || "0");

  const { data: movie, isLoading: movieLoading } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => tmdbService.getMovieDetails(movieId),
    enabled: !!movieId,
  });

  const { data: credits, isLoading: creditsLoading } = useQuery({
    queryKey: ["credits", movieId],
    queryFn: () => tmdbService.getMovieCredits(movieId),
    enabled: !!movieId,
  });

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="relative h-[60vh] bg-muted animate-pulse" />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={tmdbService.getBackdropUrl(movie.backdrop_path)}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={tmdbService.getPosterUrl(movie.poster_path)}
              alt={movie.title}
              className="w-64 rounded-lg shadow-2xl cinema-card"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-xl text-muted-foreground italic">{movie.tagline}</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({movie.vote_count.toLocaleString()} votes)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>{new Date(movie.release_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>{movie.runtime} min</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-card border border-border rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold mb-3">Overview</h2>
              <p className="text-foreground/90 leading-relaxed">{movie.overview}</p>
            </div>

            {/* Cast */}
            {!creditsLoading && credits && credits.cast.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {credits.cast.slice(0, 6).map((actor) => (
                    <div key={actor.id} className="text-center">
                      <div className="aspect-[2/3] mb-2 rounded-lg overflow-hidden cinema-card">
                        <img
                          src={tmdbService.getImageUrl(actor.profile_path)}
                          alt={actor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-semibold text-sm line-clamp-1">{actor.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {actor.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-24" />
    </div>
  );
};

export default MovieDetails;
