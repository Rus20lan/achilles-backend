import { useEffect, useState } from 'react';

const SCREEN_MD = 696;
export const useResize = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = (e) => {
      const win = e.target;
      setWidth(win.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    width,
    isScreenMD: width <= SCREEN_MD,
  };
};
