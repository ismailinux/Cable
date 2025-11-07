import { Movie } from "@/services/tmdb";
import { tmdbService } from "@/services/tmdb";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="cinema-card card-hover group cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={tmdbService.getPosterUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 fill-primary text-primary" />
          <span className="text-sm font-semibold">{movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-2 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {new Date(movie.release_date).getFullYear()}
        </p>
      </div>
    </Link>
  );
};
