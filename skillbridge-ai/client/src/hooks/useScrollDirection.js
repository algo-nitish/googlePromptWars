import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [prevOffset, setPrevOffset] = useState(0);

  useEffect(() => {
    const toggleScrollDirection = () => {
      let scrollY = window.pageYOffset;
      if (scrollY === 0) {
        setScrollDirection('up');
      }
      if (scrollY > prevOffset && scrollDirection !== 'down') {
        setScrollDirection('down');
      } else if (scrollY < prevOffset && scrollDirection !== 'up') {
        setScrollDirection('up');
      }
      setPrevOffset(scrollY);
    };

    window.addEventListener('scroll', toggleScrollDirection);
    return () => {
      window.removeEventListener('scroll', toggleScrollDirection);
    };
  }, [scrollDirection, prevOffset]);

  return scrollDirection;
}
