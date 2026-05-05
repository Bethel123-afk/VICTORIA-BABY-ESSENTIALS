import React, { useState, useEffect, ImgHTMLAttributes } from 'react';

interface PremiumImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

const PremiumImage: React.FC<PremiumImageProps> = ({ src, alt, className, style, ...props }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
  }, [src]);

  return (
    <div 
        className={`image-protocol-wrapper ${className || ''}`} 
        style={{ 
            position: 'relative', 
            overflow: 'hidden', 
            background: 'var(--gray-100)',
            width: '100%',
            height: '100%',
            ...style 
        }}
    >
        {/* Cinematic Shimmer Effect */}
        {!loaded && (
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                animation: 'premiumShimmer 1.5s infinite',
                zIndex: 1
            }}></div>
        )}

        <img
            src={src}
            alt={alt}
            {...props}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'scale(1)' : 'scale(1.05)',
                transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            loading="lazy"
        />

        <style>{`
            @keyframes premiumShimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            .image-protocol-wrapper {
                border-radius: inherit;
            }
        `}</style>
    </div>
  );
};

export default PremiumImage;
