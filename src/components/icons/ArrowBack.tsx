import React from 'react';

function ArrowBack({ color }) {
  return (
    <svg
      height="11.638"
      style={{ display: 'block' }}
      viewBox="0 0 10.142 11.638"
      width="10.142"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(1.126 .56)">
        <g
          data-name="Groupe 1368"
          fill="none"
          stroke={color}
          strokeMiterlimit="10"
          strokeWidth="1.5"
          transform="rotate(90 4.508 4.508)"
        >
          <path d="M10.518 3.113l-5.259 5.9L0 3.113" data-name="Tracé 143" />
          <path d="M0 9.015L0 0" data-name="Ligne 68" transform="translate(5.259)" />
        </g>
      </g>
    </svg>
  );
}

export default ArrowBack;
