
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", showText = false }) => {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Shadow for depth */}
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Human figures in circular pattern */}
        <g transform="translate(200, 200)">
          {[
            { color: "#4285F4", angle: 0 },    // Blue
            { color: "#EA4335", angle: 45 },   // Red
            { color: "#34A853", angle: 90 },   // Green
            { color: "#FBBC05", angle: 135 },  // Yellow
            { color: "#4285F4", angle: 180 },  // Blue
            { color: "#EA4335", angle: 225 },  // Red
            { color: "#34A853", angle: 270 },  // Green
            { color: "#FBBC05", angle: 315 },  // Yellow
          ].map((item, i) => (
            <g key={i} transform={`rotate(${item.angle})`}>
              {/* Stylized Human Figure */}
              <circle cx="0" cy="-140" r="22" fill={item.color} />
              <path 
                d="M -45,-110 C -45,-125 -25,-125 0,-125 C 25,-125 45,-125 45,-110 L 60,-40 C 60,-20 0,0 0,0 C 0,0 -60,-20 -60,-40 Z" 
                fill={item.color} 
                transform="translate(0, 0)"
              />
            </g>
          ))}
        </g>
        
        {/* Central White Circle */}
        <circle cx="200" cy="200" r="80" fill="white" filter="url(#shadow)" />
        
        {/* Central G */}
        <path 
          d="M 245,200 C 245,225 225,245 200,245 C 175,245 155,225 155,200 C 155,175 175,155 200,155 C 215,155 228,162 236,173 L 215,188 C 212,183 207,180 200,180 C 189,180 180,189 180,200 C 180,211 189,220 200,220 C 208,220 215,215 218,208 L 200,208 L 200,195 L 243,195 C 244,197 245,198 245,200 Z" 
          fill="#4285F4" 
        />
      </svg>
      {showText && (
        <div className="flex flex-col items-center leading-none mt-2">
          <span className="text-4xl font-semibold tracking-tight text-[#4285F4]">Google</span>
          <span className="text-4xl font-bold tracking-[0.15em] text-[#4285F4] opacity-80">FRIENDS</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
