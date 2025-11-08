// components/TrailerModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { tmdbService } from "@/services/tmdb";

interface TrailerModalProps {
  movieId: number;
  movieTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TrailerModal = ({
  movieId,
  movieTitle,
  open,
  onOpenChange,
}: TrailerModalProps) => {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open || !movieId) {
      setTrailerKey(null);
      setError(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(false);

    tmdbService
      .getTrailerKey(movieId)
      .then((key) => {
        if (isMounted) {
          setTrailerKey(key);
          setError(!key);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [movieId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{movieTitle} - Trailer</DialogTitle>
        </DialogHeader>

        <div className="relative aspect-video w-full bg-black">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-12 h-12 animate-spin text-white" />
            </div>
          ) : trailerKey ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`}
              title={`${movieTitle} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white space-y-6 px-4">
              <Play className="w-16 h-16 opacity-50" />
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">
                  {error ? "Trailer not available" : "No trailer found"}
                </p>
                <p className="text-sm text-white/70">
                  {movieTitle}
                </p>
              </div>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};