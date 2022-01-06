import * as React from 'react';

function CloseIcon({ color }) {
  return (
    <svg
      style={{ display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
      width="10.414"
      height="10.414"
      viewBox="0 0 10.414 10.414"
    >
      <g fill="none" stroke={color} strokeMiterlimit="10" strokeWidth="2" transform="translate(.707 .707)">
        <path d="M0 9L9 0" data-name="Ligne 329" />
        <path d="M0 0L9 9" data-name="Ligne 330" />
      </g>
    </svg>
  );
}

export default CloseIcon;
