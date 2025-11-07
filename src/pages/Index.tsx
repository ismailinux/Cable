import { useQuery } from "@tanstack/react-query";
import { tmdbService, Movie } from "@/services/tmdb";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { MovieSection } from "@/components/MovieSection";
import { useState, useEffect } from "react";

const Index = () => {
  const [popularPage, setPopularPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);

  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: () => tmdbService.getTrending("week"),
  });

  const { data: popularData, isLoading: popularLoading } = useQuery({
    queryKey: ["popular", popularPage],
    queryFn: () => tmdbService.getPopular(popularPage),
  });

  const { data: topRatedData, isLoading: topRatedLoading } = useQuery({
    queryKey: ["topRated", topRatedPage],
    queryFn: () => tmdbService.getTopRated(topRatedPage),
  });

  const { data: upcomingData, isLoading: upcomingLoading } = useQuery({
    queryKey: ["upcoming"],
    queryFn: () => tmdbService.getUpcoming(),
  });

  // Append new movies safely in useEffect
  useEffect(() => {
    if (popularData?.results) {
      setPopularMovies((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newMovies = popularData.results.filter((m) => !existingIds.has(m.id));
        return [...prev, ...newMovies];
      });
    }
  }, [popularData]);

  useEffect(() => {
    if (topRatedData?.results) {
      setTopRatedMovies((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newMovies = topRatedData.results.filter((m) => !existingIds.has(m.id));
        return [...prev, ...newMovies];
      });
    }
  }, [topRatedData]);

  const heroMovie = trendingData?.results[0] || null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection movie={heroMovie} />

      {/* Movie Sections */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 space-y-6 sm:space-y-8">
        <MovieSection
          title="Trending This Week"
          movies={trendingData?.results || []}
          loading={trendingLoading}
        />
        
        <MovieSection
          title="Popular Movies"
          movies={popularMovies}
          loading={popularLoading && popularPage === 1}
          onLoadMore={() => setPopularPage((prev) => prev + 1)}
          hasMore={popularData ? popularPage < popularData.total_pages : false}
          isLoadingMore={popularLoading && popularPage > 1}
        />
        
        <MovieSection
          title="Top Rated"
          movies={topRatedMovies}
          loading={topRatedLoading && topRatedPage === 1}
          onLoadMore={() => setTopRatedPage((prev) => prev + 1)}
          hasMore={topRatedData ? topRatedPage < topRatedData.total_pages : false}
          isLoadingMore={topRatedLoading && topRatedPage > 1}
        />
        
        <MovieSection
          title="Coming Soon"
          movies={upcomingData?.results || []}
          loading={upcomingLoading}
        />
      </div>
    </div>
  );
};

export default Index;