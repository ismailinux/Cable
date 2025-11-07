import { Antenna } from "lucide-react";
import { Link } from "react-router-dom";
import { SearchBar } from "./SearchBar";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 sm:gap-2 group shrink-0">
            <Antenna className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-lg sm:text-2xl font-bold text-gradient">Cable</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/movies"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Movies
            </Link>
            <Link
              to="/genres"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Genres
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
