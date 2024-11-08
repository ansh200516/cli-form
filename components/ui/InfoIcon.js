// components/ui/InfoIcon.js
import React from 'react';

const InfoIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke={color}
    width={size}
    height={size}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M12 4a8 8 0 100 16 8 8 0 000-16z"
    />
  </svg>
);

export default InfoIcon;