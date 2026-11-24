import React, { useState } from 'react';
import { Compass } from 'lucide-react';

interface ArtworkFrameProps {
  src: string;
  alt: string;
  title: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

export const ArtworkFrame: React.FC<ArtworkFrameProps> = ({
  src,
  alt,
  title,
  className = '',
  imgClassName = '',
  priority = false,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#EDE6DC] via-[#E3E7F0] to-[#F3E2E6] dark:from-[#161E31] dark:via-[#1C2438] dark:to-[#271C28] p-6 text-center ${className}`}
      >
        <Compass className="mb-3 h-7 w-7 text-[#C83E4D] dark:text-[#E56B7A]" aria-hidden="true" />
        <p className="font-display text-sm font-semibold text-[#171C28] dark:text-[#EEF1F7]">
          {title}
        </p>
        <p className="mt-1 text-xs text-[#525C6E] dark:text-[#9AA5BA]">
          Visual monograph plate
        </p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#EDE8DF] dark:bg-[#141A29] ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
};
