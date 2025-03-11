
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const images = [
  {
    src: "uploads/40bf477a-ad0b-486e-9a0d-83c1aff0401a.png",
    alt: "E-Parcel Logistics Facility Aerial View"
  },
  {
    src: "/uploads/vitamin-supplements.jpg",
    alt: "Various vitamin supplements in bottles"
  },
  {
    src: "/uploads/ecommerce-packaging.jpg",
    alt: "E-commerce order being packaged"
  },
  {
    src: "/uploads/person-with-box.jpg",
    alt: "Person holding a delivery box"
  }
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10" />
      
      {images.map((image, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-1000", 
            currentIndex === index ? "opacity-100" : "opacity-0"
          )}
        >
          <img 
            src={image.src} 
            alt={image.alt}
            className="w-full h-full object-cover rounded-lg transform transition-transform hover:scale-105 duration-700"
          />
        </div>
      ))}
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              currentIndex === index 
                ? "bg-primary w-4" 
                : "bg-white/60 hover:bg-white/80"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
