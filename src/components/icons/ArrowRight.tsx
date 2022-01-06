import React from 'react';

function ArrowRight({ color }) {
  return (
    <svg
      style={{ display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
      width="7.036"
      height="11"
      viewBox="0 0 7.036 11"
    >
      <defs>
        <clipPath id="clip-path">
          <path fill="none" stroke="#000" strokeWidth="2" d="M0 0H11V7.036H0z" data-name="Rectangle 992" />
        </clipPath>
      </defs>
      <g>
        <g clipPath="url(#clip-path)" data-name="Groupe 1758" transform="rotate(-90 5.5 5.5)">
          <path
            fill="none"
            stroke={color}
            strokeMiterlimit="10"
            strokeWidth="2"
            d="M10.232.767L5.5 5.499.768.767"
            data-name="Tracé 249"
          />
        </g>
      </g>
    </svg>
  );
}

export default ArrowRight;
