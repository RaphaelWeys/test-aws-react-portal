import useWindowSize from './useWindowSize';

const useDesktop = () => {
  const [width] = useWindowSize();

  return width > 850;
};

export default useDesktop;
