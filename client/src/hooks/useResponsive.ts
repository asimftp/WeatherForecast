import { useState, useEffect } from "react";

// Breakpoints matching common device sizes
const BREAKPOINTS = {
  sm: 640,  // Small devices (phones)
  md: 768,  // Medium devices (tablets)
  lg: 1024, // Large devices (laptops)
  xl: 1280, // Extra large devices (desktops)
};

type BreakpointKey = keyof typeof BREAKPOINTS;

/**
 * Hook to check if the current viewport matches a specific breakpoint
 * @returns Object with methods to check different responsive states
 */
export function useResponsive() {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if viewport is smaller than a specific breakpoint
  const isSmallerThan = (breakpoint: BreakpointKey): boolean => {
    return windowWidth < BREAKPOINTS[breakpoint];
  };

  // Check if viewport is larger than a specific breakpoint
  const isLargerThan = (breakpoint: BreakpointKey): boolean => {
    return windowWidth >= BREAKPOINTS[breakpoint];
  };

  // Check if viewport is between two breakpoints
  const isBetween = (minBreakpoint: BreakpointKey, maxBreakpoint: BreakpointKey): boolean => {
    return windowWidth >= BREAKPOINTS[minBreakpoint] && windowWidth < BREAKPOINTS[maxBreakpoint];
  };

  // Convenience methods for common device types
  return {
    isMobile: isSmallerThan('md'),
    isTablet: isBetween('md', 'lg'),
    isDesktop: isLargerThan('lg'),
    isSmallerThan,
    isLargerThan,
    isBetween,
    windowWidth,
  };
}

export default useResponsive; 