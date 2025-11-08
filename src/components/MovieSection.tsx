import { Movie } from "@/services/tmdb";
import { MovieCard } from "./MovieCard";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export const MovieSection = ({
  title,
  movies,
  loading,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: MovieSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;

    // Calculate visible width and number of visible cards
    const containerWidth = container.clientWidth;
    const firstCard = container.querySelector("div.flex-none") as HTMLElement | null;
    const cardWidth = firstCard?.offsetWidth || 180;
    const gap = 16; // matches gap-4
    const cardsPerView = Math.floor(containerWidth / (cardWidth + gap));

    // Scroll by full page (cardsPerView * (card + gap)), but subtract final gap
    const pageScrollAmount = cardsPerView * (cardWidth + gap) - gap;

    if (direction === "right") {
      container.scrollBy({ left: pageScrollAmount, behavior: "smooth" });

      // Load more if near end (within 1 page)
      if (onLoadMore && hasMore && !isLoadingMore) {
        const isNearEnd =
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth - pageScrollAmount;

        if (isNearEnd && !isFetchingMore) {
          setIsFetchingMore(true);
          onLoadMore();
        }
      }
    } else {
      container.scrollBy({ left: -pageScrollAmount, behavior: "smooth" });
    }
  };

  // Reset spinner when parent signals loading is complete
  useEffect(() => {
    if (!isLoadingMore && isFetchingMore) {
      const timer = setTimeout(() => setIsFetchingMore(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoadingMore, isFetchingMore]);

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="cinema-card animate-pulse">
              <div className="aspect-[2/3] bg-muted" />
              <div className="p-4">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12 relative group">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      {/* Left Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 
             opacity-100 md:opacity-0 
             md:group-hover:opacity-100 
             transition-opacity 
             bg-background/80 backdrop-blur-sm hover:bg-background active:scale-95"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      {/* Right Button - Shows Spinner During Load More */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 
             opacity-100 md:opacity-0 
             md:group-hover:opacity-100 
             transition-opacity 
             bg-background/80 backdrop-blur-sm hover:bg-background active:scale-95"
        onClick={() => scroll("right")}
        disabled={isFetchingMore}
      >
        {isFetchingMore ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <ChevronRight className="w-6 h-6" />
        )}
      </Button>

      <div
        ref={scrollContainerRef}
        className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex-none w-[140px] sm:w-[180px] md:w-[220px]"
          >
            <MovieCard movie={movie} />
          </div>
        ))}
        {isLoadingMore && (
          <div className="flex-none w-[140px] sm:w-[180px] md:w-[220px]">
            <div className="cinema-card animate-pulse">
              <div className="aspect-[2/3] bg-muted" />
              <div className="p-4">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};