import React, { FC } from 'react';

const AccountIcon: FC<{ color: string }> = ({ color }) => (
    <svg
      height="23.13"
      style={{ display: 'block' }}
      viewBox="0 0 27.796 33.006"
      width="19.4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g data-name="picto-compte-noir " id="picto-compte-noir_" transform="translate(-1670.582 -32.25)">
        <path
          d="M1699.482,46.337a5.3,5.3,0,1,1-5.3,5.3A5.3,5.3,0,0,1,1699.482,46.337Z"
          data-name="Tracé 164"
          fill="none"
          id="Tracé_164"
          stroke={color}
          strokeMiterlimit="10"
          strokeWidth="1.5"
          transform="translate(-15 -13.337)"
        />
        <path
          d="M1712.627,77.843h-26.294c0-1.566.009-3.476.009-5.819,0-6.258,5.885-11.332,13.139-11.332a14.222,14.222,0,0,1,9.29,3.32,10.592,10.592,0,0,1,3.853,8.01C1712.621,74.367,1712.627,76.28,1712.627,77.843Z"
          data-name="Tracé 165"
          fill="none"
          id="Tracé_165"
          stroke={color}
          strokeMiterlimit="10"
          strokeWidth="1.5"
          transform="translate(-15 -13.337)"
        />
        <line
          data-name="Ligne 83"
          fill="none"
          id="Ligne_83"
          stroke={color}
          strokeMiterlimit="10"
          strokeWidth="1.5"
          transform="translate(1677.714 56.951)"
          y1="7.555"
        />
        <line
          data-name="Ligne 84"
          fill="none"
          id="Ligne_84"
          stroke={color}
          strokeMiterlimit="10"
          strokeWidth="1.5"
          transform="translate(1691.251 56.951)"
          y1="7.555"
        />
      </g>
    </svg>
  );

export default AccountIcon;
