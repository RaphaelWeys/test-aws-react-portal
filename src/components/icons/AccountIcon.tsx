import React, { FC } from 'react';

interface Props {
  color: string;
}

const AccountIcon: FC<Props> = ({ color }) => {
  return (
    <svg
      style={{ display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
      width="19.4"
      height="23.13"
      viewBox="0 0 27.796 33.006"
    >
      <g id="picto-compte-noir_" data-name="picto-compte-noir " transform="translate(-1670.582 -32.25)">
        <path
          id="Tracé_164"
          data-name="Tracé 164"
          d="M1699.482,46.337a5.3,5.3,0,1,1-5.3,5.3A5.3,5.3,0,0,1,1699.482,46.337Z"
          transform="translate(-15 -13.337)"
          fill="none"
          stroke={color}
          strokeMiterlimit="10"
          strokeWidth="1.5"
        />
        <path
          id="Tracé_165"
          data-name="Tracé 165"
          d="M1712.627,77.843h-26.294c0-1.566.009-3.476.009-5.819,0-6.258,5.885-11.332,13.139-11.332a14.222,14.222,0,0,1,9.29,3.32,10.592,10.592,0,0,1,3.853,8.01C1712.621,74.367,1712.627,76.28,1712.627,77.843Z"
          transform="translate(-15 -13.337)"
          fill="none"
          stroke={color}
          strokeMiterlimit="10"
          strokeWidth="1.5"
        />
        <line
          id="Ligne_83"
          data-name="Ligne 83"
          y1="7.555"
          transform="translate(1677.714 56.951)"
          fill="none"
          stroke={color}
          strokeMiterlimit="10"
          strokeWidth="1.5"
        />
        <line
          id="Ligne_84"
          data-name="Ligne 84"
          y1="7.555"
          transform="translate(1691.251 56.951)"
          fill="none"
          stroke={color}
          strokeMiterlimit="10"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
};

export default AccountIcon;
