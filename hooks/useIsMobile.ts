"use client";

import { useState, useEffect } from "react";

export const useIsMobile = (breakpoint: number = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window === "undefined") return false;
      return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
    };

    setIsMobile(checkMobile());

    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

      const handleResize = (event: MediaQueryListEvent) => {
        setIsMobile(event.matches);
      };

      mediaQuery.addEventListener("change", handleResize);

      return () => mediaQuery.removeEventListener("change", handleResize);
    }
  }, [breakpoint]);

  return isMobile;
};
