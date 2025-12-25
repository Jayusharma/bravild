import { ChevronDown } from "lucide-react";

export default function ScrollDownButton() {
  const handleScroll = () => {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex items-center justify-center">
      {/* Scroll Down Button */}
      <button
        onClick={handleScroll}
        className="group relative w-16 h-24 border-2 border-white/20 rounded-full hover:border-white/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10 bg-white/5 backdrop-blur-sm"
        aria-label="Scroll down"
      >
        {/* Animated dot */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/60 rounded-full animate-bounce group-hover:bg-white/80 transition-colors duration-300" />
        
        {/* Bottom chevron */}
        <ChevronDown 
          size={16} 
          className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-white/40 group-hover:text-white/70 transition-colors duration-300" 
        />
        
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
      </button>
      
      {/* Optional text hint */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/40 text-xs font-light tracking-widest">
        SCROLL
      </div>
    </div>
  );
}