import React from 'react';

interface SkeletonProps {
  width: string | number;
  height: string | number;
  borderRadius?: string;
  marginBottom?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  width, 
  height, 
  borderRadius = '4px', 
  marginBottom = '0px' 
}) => {
    return (
        <div className="skeleton-box" style={{
            width,
            height,
            borderRadius,
            marginBottom,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-shimmer 1.5s infinite linear'
        }}>
            <style>{`
                @keyframes skeleton-shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </div>
    );
};

export default Skeleton;
