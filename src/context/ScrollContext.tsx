import React, { FC, useContext } from 'react';

const ScrollContext = React.createContext<HTMLDivElement | null>(null);

interface IScrollProvider {
  scroll: HTMLDivElement | null;
}

const ScrollProvider: FC<IScrollProvider> = ({ children, scroll }) => {
  return <ScrollContext.Provider value={scroll}>{children}</ScrollContext.Provider>;
};

function useScroll() {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
}

export { ScrollProvider, useScroll, ScrollContext };
