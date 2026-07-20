import { useState } from "react";

interface EmptyIconProps {
  src: string;
  alt: string;
  fallbackEmoji: string;
}

export function EmptyIcon({ src, alt, fallbackEmoji }: EmptyIconProps) {
  const [gagalMuat, setGagalMuat] = useState(false);

  if (gagalMuat) {
    return <span className="text-4xl">{fallbackEmoji}</span>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-12 w-12 object-contain"
      onError={() => setGagalMuat(true)}
    />
  );
}
