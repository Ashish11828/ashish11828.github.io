import React from 'react';

export type CountryCode =
  | 'IN'
  | 'DE'
  | 'JP'
  | 'US'
  | 'IT'
  | 'PL'
  | 'AE'
  | 'ES'
  | 'EE'
  | 'GB'
  | 'PT'
  | 'FR';

export const COUNTRY_NAMES: Record<CountryCode, string> = {
  IN: 'India',
  DE: 'Germany',
  JP: 'Japan',
  US: 'United States',
  IT: 'Italy',
  PL: 'Poland',
  AE: 'United Arab Emirates',
  ES: 'Spain',
  EE: 'Estonia',
  GB: 'United Kingdom',
  PT: 'Portugal',
  FR: 'France',
};

interface CountryFlagProps {
  code: CountryCode;
  className?: string;
  decorative?: boolean;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  code,
  className = 'h-[14px] w-[21px]',
  decorative = true,
}) => {
  const label = COUNTRY_NAMES[code];
  const phase = (code.charCodeAt(0) + code.charCodeAt(1)) % 4;
  const baseClass = `inline-block shrink-0 rounded-[2px] ring-1 ring-black/15 shadow-sm shadow-[#171C28]/18 symbol-float-micro symbol-float-${phase} dark:ring-white/20 dark:shadow-black/45 ${className}`;
  const a11yProps = decorative
    ? { 'aria-hidden': true as const, focusable: false as const }
    : { role: 'img' as const, 'aria-label': label, focusable: false as const };

  switch (code) {
    case 'IN':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} {...a11yProps}>
          <rect width="30" height="6.67" y="0" fill="#FF9933" />
          <rect width="30" height="6.67" y="6.67" fill="#FFFFFF" />
          <rect width="30" height="6.67" y="13.33" fill="#138808" />
          <circle cx="15" cy="10" r="2.4" fill="none" stroke="#000080" strokeWidth="0.7" />
          <circle cx="15" cy="10" r="0.55" fill="#000080" />
        </svg>
      );

    case 'DE':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} {...a11yProps}>
          <rect width="30" height="6.67" y="0" fill="#111111" />
          <rect width="30" height="6.67" y="6.67" fill="#DD0000" />
          <rect width="30" height="6.67" y="13.33" fill="#FFCE00" />
        </svg>
      );

    case 'JP':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} {...a11yProps}>
          <rect width="30" height="20" fill="#FFFFFF" />
          <circle cx="15" cy="10" r="5.5" fill="#BC002D" />
        </svg>
      );

    case 'US':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} {...a11yProps}>
          <rect width="30" height="20" fill="#FFFFFF" />
          <rect width="30" height="1.54" y="0" fill="#B22234" />
          <rect width="30" height="1.54" y="3.08" fill="#B22234" />
          <rect width="30" height="1.54" y="6.15" fill="#B22234" />
          <rect width="30" height="1.54" y="9.23" fill="#B22234" />
          <rect width="30" height="1.54" y="12.31" fill="#B22234" />
          <rect width="30" height="1.54" y="15.38" fill="#B22234" />
          <rect width="30" height="1.54" y="18.46" fill="#B22234" />
          <rect width="12.5" height="10.77" y="0" fill="#3C3B6E" />
          <g fill="#FFFFFF">
            <circle cx="2.5" cy="2.2" r="0.65" />
            <circle cx="5.5" cy="2.2" r="0.65" />
            <circle cx="8.5" cy="2.2" r="0.65" />
            <circle cx="11" cy="2.2" r="0.65" />
            <circle cx="4" cy="4.4" r="0.65" />
            <circle cx="7" cy="4.4" r="0.65" />
            <circle cx="10" cy="4.4" r="0.65" />
            <circle cx="2.5" cy="6.6" r="0.65" />
            <circle cx="5.5" cy="6.6" r="0.65" />
            <circle cx="8.5" cy="6.6" r="0.65" />
            <circle cx="11" cy="6.6" r="0.65" />
            <circle cx="4" cy="8.8" r="0.65" />
            <circle cx="7" cy="8.8" r="0.65" />
            <circle cx="10" cy="8.8" r="0.65" />
          </g>
        </svg>
      );

    case 'IT':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} {...a11yProps}>
          <rect width="10" height="20" x="0" fill="#009246" />
          <rect width="10" height="20" x="10" fill="#FFFFFF" />
          <rect width="10" height="20" x="20" fill="#CE2B37" />
        </svg>
      );

    case 'PL':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} {...a11yProps}>
          <rect width="30" height="10" y="0" fill="#FFFFFF" />
          <rect width="30" height="10" y="10" fill="#DC143C" />
        </svg>
      );

    case 'AE':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} {...a11yProps}>
          <rect width="30" height="6.67" y="0" fill="#00732F" />
          <rect width="30" height="6.67" y="6.67" fill="#FFFFFF" />
          <rect width="30" height="6.67" y="13.33" fill="#111111" />
          <rect width="7.5" height="20" x="0" fill="#FF0000" />
        </svg>
      );

    case 'ES':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} {...a11yProps}>
          <rect width="30" height="5" y="0" fill="#AA151B" />
          <rect width="30" height="10" y="5" fill="#F1BF00" />
          <rect width="30" height="5" y="15" fill="#AA151B" />
          <rect width="3" height="4.2" x="7.5" y="7.9" rx="0.6" fill="#AA151B" />
          <rect width="1.6" height="2.2" x="8.2" y="8.8" fill="#F1BF00" />
        </svg>
      );

    case 'EE':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} {...a11yProps}>
          <rect width="30" height="6.67" y="0" fill="#0072CE" />
          <rect width="30" height="6.67" y="6.67" fill="#111111" />
          <rect width="30" height="6.67" y="13.33" fill="#FFFFFF" />
        </svg>
      );

    case 'GB':
      return (
        <svg viewBox="0 0 60 30" className={baseClass} {...a11yProps}>
          <rect width="60" height="30" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2.5" />
          <path d="M30,0 V30 M0,15 H60" stroke="#FFFFFF" strokeWidth="10" />
          <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
        </svg>
      );

    case 'PT':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} {...a11yProps}>
          <rect width="12" height="20" x="0" fill="#046A38" />
          <rect width="18" height="20" x="12" fill="#DA291C" />
          <circle cx="12" cy="10" r="3.6" fill="#FFE900" stroke="#B8860B" strokeWidth="0.5" />
          <rect x="10.6" y="8.4" width="2.8" height="3.2" rx="0.6" fill="#DA291C" />
          <rect x="11.3" y="9.1" width="1.4" height="1.8" rx="0.3" fill="#FFFFFF" />
        </svg>
      );

    case 'FR':
      return (
        <svg viewBox="0 0 30 20" className={baseClass} {...a11yProps}>
          <rect width="10" height="20" x="0" fill="#002395" />
          <rect width="10" height="20" x="10" fill="#FFFFFF" />
          <rect width="10" height="20" x="20" fill="#ED2939" />
        </svg>
      );
  }
};
