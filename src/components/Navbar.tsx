// Navbar.tsx
import { Antenna, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import * as React from "react";

export const Navbar = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Close drawer when resizing to desktop
  React.useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  const navLinks = (
    <>
      <Link
        to="/"
        className="text-foreground hover:text-primary transition-colors font-medium"
        onClick={() => setOpen(false)}
      >
        Home
      </Link>
      <Link
        to="/movies"
        className="text-foreground hover:text-primary transition-colors font-medium"
        onClick={() => setOpen(false)}
      >
        Movies
      </Link>
      <Link
        to="/genres"
        className="text-foreground hover:text-primary transition-colors font-medium"
        onClick={() => setOpen(false)}
      >
        Genres
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 sm:gap-2 group shrink-0">
            <Antenna className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-lg sm:text-2xl font-bold text-gradient">Cable</span>
          </Link>

          {/* Search – always visible, takes available space */}
          <div className="flex-1 max-w-2xl mx-4">
            <SearchBar />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
            {navLinks}
          </div>

          {/* Mobile Hamburger */}
          {isMobile !== undefined && isMobile && (
            <button
              onClick={() => setOpen(true)}
              className="md:hidden p-1 rounded-md hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobile && open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Sheet */}
          <div className="relative ml-auto w-64 max-w-full bg-background shadow-xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-md hover:bg-muted transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-1 p-4">
              {navLinks}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};