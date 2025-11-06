import React from 'react'

// Small, lightweight SVG logo used across the app (Navbar, hero, etc.)
// Props:
// - size: pixel height/width for the square SVG
// - className: extra classes (e.g., text color utilities)
type LogoProps = {
  size?: number
  className?: string
}

export default function Logo({ size = 32, className = '' }: LogoProps) {
  const s = size
  return (
    <svg
      className={className}
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
    >
      <rect x="2" y="6" width="20" height="12" rx="2" fill="#EFF6FF" />
      <path d="M3 7.5c4-2 7-2 9 0 2-2 5-2 9 0" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3v4" stroke="#6366F1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1.6" fill="#7C3AED" />
    </svg>
  )
}
