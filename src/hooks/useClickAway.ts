import { useCallback, useEffect, useState } from 'react';

const useClickAway = (ref: React.MutableRefObject<HTMLDivElement | null>): [boolean, (v: boolean) => void] => {
  const [isVisible, setIsVisible] = useState(false);

  const onMouseDown = useCallback(
    (event) => {
      if (ref?.current && !ref.current.contains(event.target)) {
        setIsVisible(false);
      }
    },
    [ref, setIsVisible],
  );

  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [onMouseDown]);

  return [isVisible, setIsVisible];
};

export default useClickAway;
