"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { useHeader } from "./headerContext";

const Myhead = () => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { svgColor } = useHeader();

  useEffect(() => {
    // Get initial dimensions
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < lastScrollY) {
        setShowHeader(true); // scrolling up
      } else {
        setShowHeader(false); // scrolling down
      }
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed top-0 w-[98vw] transition-transform duration-1000 ease-in-out z-50 px-2 ${
        showHeader ? "translate-y-0" : "-translate-y-50 pointer-events-none"
      }`}
    >
      <svg
        className="w-full h-[7vh] fixed z-999"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="heroGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <polygon
          id="heroPolygon"
          points={`0,0 ${dimensions.width},0 ${dimensions.width * 0.98},${dimensions.height} ${dimensions.width * 0.58},${dimensions.height} ${dimensions.width * 0.55},${dimensions.height * 0.2} 0,${dimensions.height * 0.2}`}
          fill={svgColor}
          
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          filter="url(#heroGlow)"
        />
      </svg>

      {/* Navigation Buttons */}
      <div className="absolute top-0 right-10 flex items-center space-x-25 pr-8 h-[7vh] z-[1000]">
        <Link 
          href="/about" 
          className="text-black hover:text-[#ebe9e3] transition-colors duration-300 font-medium text-lg"
        >
          Home
        </Link>
        <Link 
          href="/about" 
          className="text-black hover:text-[#ebe9e3] transition-colors duration-300 font-medium text-lg"
        >
          About
        </Link>
        <Link 
          href="/projects" 
          className="text-black hover:text-[#ebe9e3] transition-colors duration-300 font-medium text-lg"
        >
          Projects
        </Link>
        <Link 
          href="/contact" 
          className="text-black hover:text-[#ebe9e3] transition-colors duration-300 font-medium text-lg"
        >
          Contact
        </Link>
      </div>
    </div>
  );
};

export default Myhead;