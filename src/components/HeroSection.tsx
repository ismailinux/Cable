import { Movie, tmdbService } from "@/services/tmdb";
import { Button } from "@/components/ui/button";
import { Play, Info, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  movie: Movie | null;
}

export const HeroSection = ({ movie }: HeroSectionProps) => {
  if (!movie) {
    return (
      <div className="relative h-[70vh] bg-muted animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Backdrop image */}
      <div className="absolute inset-0">
        <img
          src={tmdbService.getBackdropUrl(movie.backdrop_path)}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-2 sm:px-4 flex items-center">
        <div className="max-w-2xl space-y-3 sm:space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-primary/20 backdrop-blur-sm px-3 py-1 rounded-full border border-primary/30">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm font-semibold text-primary">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
            <span className="text-muted-foreground">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            {movie.title}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-foreground/90 line-clamp-2 sm:line-clamp-3">
            {movie.overview}
          </p>

          <div className="flex gap-2 sm:gap-4">
            <Button size="sm" className="cinema-button text-xs sm:text-sm sm:size-default" asChild>
              <Link to={`/movie/${movie.id}`}>
                <Info className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                More Info
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="border-foreground/20 hover:bg-foreground/10 text-xs sm:text-sm sm:size-default">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                Trailer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
