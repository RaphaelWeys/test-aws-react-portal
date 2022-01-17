import React from 'react';

function InfoIcon({ color = '#BDBEBF' }) {
  return (
    <svg
      height="24.2"
      style={{ display: 'block' }}
      viewBox="0 0 24.2 24.2"
      width="24.2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(-.216 -.217)">
        <g
          data-name="Groupe 1778"
          fill="none"
          stroke={color}
          strokeMiterlimit="10"
          strokeWidth="1.2"
          transform="translate(.816 .817)"
        >
          <path d="M23 11.5A11.5 11.5 0 1111.5 0 11.5 11.5 0 0123 11.5z" data-name="Tracé 258" />
          <path d="M0 0L0 7.84" data-name="Ligne 281" transform="translate(11.501 10.027)" />
          <path d="M0 2.139L0 0" data-name="Ligne 282" transform="translate(11.5 5.683)" />
        </g>
      </g>
    </svg>
  );
}

export default InfoIcon;
