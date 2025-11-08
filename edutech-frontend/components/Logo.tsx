import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

type LogoProps = SvgIconProps & {
  size?: number;
};

export default function Logo({ size = 32, sx, ...props }: LogoProps) {
  return (
    <SvgIcon
      {...props}
      sx={{
        width: size,
        height: size,
        ...sx
      }}
      viewBox="0 0 24 24"
    >
      <rect x="2" y="6" width="20" height="12" rx="2" fill="currentColor" opacity="0.1" />
      <path 
        d="M3 7.5c4-2 7-2 9 0 2-2 5-2 9 0" 
        stroke="currentColor" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
      <path 
        d="M12 3v4" 
        stroke="currentColor" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </SvgIcon>
  );
}