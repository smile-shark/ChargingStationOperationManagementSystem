import { useEffect, useState } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

export function useCountUp(target: number, duration = 1) {
  const [count, setCount] = useState(0);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 20,
  });

  useEffect(() => {
    motionValue.set(0);
    const unsubscribe = springValue.onChange((latest) => {
      setCount(Math.round(latest));
    });

    motionValue.set(target);

    return () => unsubscribe();
  }, [target, motionValue, springValue]);

  return count;
}
