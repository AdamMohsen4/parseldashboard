
import React, { useEffect, useRef } from 'react';
import { Building } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Partner data structure
interface Partner {
  id: number;
  name: string;
  logo?: string; // Optional path to logo image
  industry: string;
}

// Sample partners data
const partners: Partner[] = [
  { id: 1, name: 'TechBox', logo: 'Hardware', industry: 'Technology' },
  { id: 2, name: 'GreenLogistics', industry: 'Logistics' },
  { id: 3, name: 'SwedishHome', industry: 'Retail' },
  { id: 4, name: 'MalmöFashion', industry: 'Fashion' },
  { id: 5, name: 'NordicFresh', industry: 'Food & Beverage' },
  { id: 6, name: 'EcoDeliver', industry: 'Delivery' },
  { id: 7, name: 'StockGo', industry: 'E-commerce' },
  { id: 8, name: 'OsloTech', industry: 'Technology' },
  { id: 9, name: 'HelsinkiDesign', industry: 'Design' },
  { id: 10, name: 'CopenStyle', industry: 'Fashion' },
];

interface PartnersCarouselProps {
  speed?: number; // Animation speed in seconds
}

const PartnersCarousel: React.FC<PartnersCarouselProps> = ({ speed = 30 }) => {
  const { t } = useTranslation();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create the animation
    if (!scrollerRef.current || !contentRef.current) return;
    
    // Clone the content for seamless looping
    const contentWidth = contentRef.current.offsetWidth;
    
    // Set the animation
    scrollerRef.current.setAttribute(
      'style',
      `--animation-duration: ${speed}s; --content-width: ${contentWidth}px`
    );
  }, [speed]);

  return (
    <div className="w-full overflow-hidden bg-secondary/5 py-8">
      <h3 className="text-2xl font-bold text-center mb-6">
        {t('home.partners.title', 'Our Trusted Partners')}
      </h3>
      
      <div 
        ref={scrollerRef}
        className="scroller relative flex overflow-hidden"
      >
        <div 
          ref={contentRef}
          className="flex animate-scroll-x"
          style={{
            animationDuration: `${speed}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            animationName: 'scroll',
            minWidth: '100%',
          }}
        >
          {/* First set of partners */}
          {partners.map(partner => (
            <div key={partner.id} className="flex-none mx-6 w-48 h-24 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center justify-center p-4">
              {partner.logo ? (
                <img src={partner.logo} alt={partner.name} className="h-10 w-auto object-contain mb-2" />
              ) : (
                <Building className="h-10 w-10 text-primary mb-2" />
              )}
              <p className="font-medium text-sm text-center">{partner.name}</p>
              <p className="text-xs text-muted-foreground">{partner.industry}</p>
            </div>
          ))}
          
          {/* Duplicate partners for seamless loop */}
          {partners.map(partner => (
            <div key={`${partner.id}-dup`} className="flex-none mx-6 w-48 h-24 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center justify-center p-4">
              {partner.logo ? (
                <img src={partner.logo} alt={partner.name} className="h-10 w-auto object-contain mb-2" />
              ) : (
                <Building className="h-10 w-10 text-primary mb-2" />
              )}
              <p className="font-medium text-sm text-center">{partner.name}</p>
              <p className="text-xs text-muted-foreground">{partner.industry}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersCarousel;
