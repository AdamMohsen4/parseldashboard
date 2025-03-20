
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'bordered' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', elevation = 2, children, ...props }, ref) => {
    // Base classes
    const baseClasses = 'rounded-lg transition-all';
    
    // Variant classes
    const variantClasses = {
      default: 'bg-card text-card-foreground',
      glass: 'bg-glass backdrop-blur-glass border border-white/20',
      bordered: 'bg-card text-card-foreground border border-border',
      flat: 'bg-secondary text-secondary-foreground'
    };
    
    // Padding classes
    const paddingClasses = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-8'
    };
    
    // Elevation classes
    const elevationClasses = {
      0: '',
      1: 'shadow-elevation-1',
      2: 'shadow-elevation-2',
      3: 'shadow-elevation-3',
      4: 'shadow-elevation-4',
      5: 'shadow-elevation-5'
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          paddingClasses[padding],
          elevationClasses[elevation],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
