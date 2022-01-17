import * as React from 'react';

function CloseIcon({ color }) {
  return (
    <svg
      height="10.414"
      style={{ display: 'block' }}
      viewBox="0 0 10.414 10.414"
      width="10.414"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" stroke={color} strokeMiterlimit="10" strokeWidth="2" transform="translate(.707 .707)">
        <path d="M0 9L9 0" data-name="Ligne 329" />
        <path d="M0 0L9 9" data-name="Ligne 330" />
      </g>
    </svg>
  );
}

export default CloseIcon;
