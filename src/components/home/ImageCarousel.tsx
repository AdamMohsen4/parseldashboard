
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';

interface CarouselImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  autoSlideInterval?: number; // in milliseconds
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  autoSlideInterval = 5000,
  className
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation();
  
  React.useEffect(() => {
    if (!autoSlideInterval) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, autoSlideInterval);
    
    return () => clearInterval(interval);
  }, [autoSlideInterval, images.length]);
  
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  };
  
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  return (
    <div className={cn("relative rounded-xl overflow-hidden shadow-xl", className)}>
      {/* Main image container */}
      <div className="relative aspect-video overflow-hidden">
        {images.map((image, index) => (
          <div 
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <img 
              src={image.src} 
              alt={image.alt} 
              className="w-full h-full object-cover"
            />
            
            {/* Overlay with text */}
            {(image.title || image.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                {image.title && <h3 className="text-xl font-semibold mb-2">{image.title}</h3>}
                {image.description && <p className="text-sm md:text-base">{image.description}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Navigation buttons */}
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-background/50 hover:bg-background/80 text-foreground"
        onClick={goToPrevious}
        aria-label={t('common.previous')}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-background/50 hover:bg-background/80 text-foreground"
        onClick={goToNext}
        aria-label={t('common.next')}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
      
      {/* Dots indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-colors",
              index === currentIndex 
                ? "bg-primary" 
                : "bg-background/50 hover:bg-background/80"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
