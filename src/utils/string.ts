import React from 'react';

import InvisibleButton from '../components/InvisibleButton/InvisibleButton';

export const getTextWithFunctionInside = (...args) =>
  args
    .map<React.ReactNode>((arg) => {
      if (Array.isArray(arg)) return React.createElement(InvisibleButton, { onClick: arg[0] }, arg[1]);
      return arg;
    })
    .reduce((prev, curr, index) => [prev, ' ', React.createElement('span', { key: index }, curr)]);
