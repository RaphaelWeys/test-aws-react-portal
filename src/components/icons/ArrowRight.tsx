import React from 'react';

function ArrowRight({ color }) {
  return (
    <svg
      height="11"
      style={{ display: 'block' }}
      viewBox="0 0 7.036 11"
      width="7.036"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="clip-path">
          <path d="M0 0H11V7.036H0z" data-name="Rectangle 992" fill="none" stroke="#000" strokeWidth="2" />
        </clipPath>
      </defs>
      <g>
        <g clipPath="url(#clip-path)" data-name="Groupe 1758" transform="rotate(-90 5.5 5.5)">
          <path
            d="M10.232.767L5.5 5.499.768.767"
            data-name="Tracé 249"
            fill="none"
            stroke={color}
            strokeMiterlimit="10"
            strokeWidth="2"
          />
        </g>
      </g>
    </svg>
  );
}

export default ArrowRight;
