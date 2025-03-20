
// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Menu, X, Package, User, BarChart2, Tag } from 'lucide-react';
// import Button from '../common/Button';
// import { cn } from '@/lib/utils';

// interface NavItem {
//   name: string;
//   path: string;
//   icon: React.ReactNode;
// }

// const Header: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const location = useLocation();
  
//   // Nav items configuration
//   const navItems: NavItem[] = [
//     { name: 'Dashboard', path: '/dashboard', icon: <BarChart2 className="h-5 w-5" /> },
//     { name: 'Book Shipment', path: '/booking', icon: <Package className="h-5 w-5" /> },
//     { name: 'Labels', path: '/labels', icon: <Tag className="h-5 w-5" /> },
//     { name: 'Compliance', path: '/compliance', icon: <BarChart2 className="h-5 w-5" /> },
//   ];
  
//   // Handle scroll effects
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 10) {
//         setScrolled(true);
//       } else {
//         setScrolled(false);
//       }
//     };
    
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);
  
//   // Close menu when route changes
//   useEffect(() => {
//     setIsOpen(false);
//   }, [location.pathname]);
  
//   return (
//     <header
//       className={cn(
//         'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
//         scrolled 
//           ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3'
//           : 'bg-transparent py-5'
//       )}
//     >
//       <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
//         {/* Logo */}
//         <Link 
//           to="/" 
//           className="flex items-center space-x-2 text-foreground"
//         >
//           <Package className="h-8 w-8 text-nordic-blue" strokeWidth={2} />
//           <span className="text-xl font-semibold tracking-tight">E-Parsel</span>
//         </Link>
        
//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex items-center space-x-8">
//           {navItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={cn(
//                 'flex items-center text-sm font-medium transition-colors hover:text-primary',
//                 location.pathname === item.path 
//                   ? 'text-primary' 
//                   : 'text-muted-foreground'
//               )}
//             >
//               {item.name}
//             </Link>
//           ))}
//         </nav>
        
//         {/* Auth & Mobile Menu Toggle */}
//         <div className="flex items-center space-x-4">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="hidden md:flex items-center text-sm font-medium"
//             icon={<User className="h-4 w-4" />}
//           >
//             Sign in
//           </Button>
          
//           <Button
//             variant="default"
//             size="sm"
//             className="hidden md:flex"
//           >
//             Get Started
//           </Button>
          
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
//             aria-label="Toggle menu"
//           >
//             {isOpen ? (
//               <X className="h-6 w-6" />
//             ) : (
//               <Menu className="h-6 w-6" />
//             )}
//           </button>
//         </div>
//       </div>
      
//       {/* Mobile Navigation */}
//       {isOpen && (
//         <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border animate-slide-down">
//           <nav className="container mx-auto px-4 py-5 flex flex-col space-y-4">
//             {navItems.map((item) => (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={cn(
//                   'flex items-center space-x-3 p-2 rounded-md',
//                   location.pathname === item.path 
//                     ? 'bg-primary/10 text-primary' 
//                     : 'text-foreground hover:bg-secondary'
//                 )}
//               >
//                 {item.icon}
//                 <span>{item.name}</span>
//               </Link>
//             ))}
            
//             <div className="pt-4 flex space-x-4 border-t border-border">
//               <Button 
//                 variant="outline" 
//                 className="flex-1"
//                 icon={<User className="h-4 w-4" />}
//               >
//                 Sign in
//               </Button>
              
//               <Button 
//                 variant="default" 
//                 className="flex-1"
//               >
//                 Get Started
//               </Button>
//             </div>
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;
