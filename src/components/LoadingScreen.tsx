import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      onLoadingComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-secondary to-accent">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Dotted Heart Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <Heart 
              className="w-24 h-24 text-primary animate-heart-pulse" 
              fill="currentColor"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
            {/* Floating Hearts */}
            <Heart 
              className="absolute -top-4 -right-4 w-6 h-6 text-primary/60 animate-float" 
              fill="currentColor"
              style={{ animationDelay: '0.5s' }}
            />
            <Heart 
              className="absolute -bottom-4 -left-4 w-6 h-6 text-primary/60 animate-float" 
              fill="currentColor"
              style={{ animationDelay: '1s' }}
            />
          </div>
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gradient">
            Mamor
          </h1>
          <p className="text-muted-foreground text-lg">
            Carregando momentos especiais...
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};