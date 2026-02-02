
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8", showText = true }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <svg viewBox="0 0 100 120" className="h-full w-auto drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M75 35V25C75 11.1929 63.8071 0 50 0C36.1929 0 25 11.1929 25 25V35" stroke="#0F172A" strokeWidth="8" strokeLinecap="round"/>
        <rect x="5" y="30" width="90" height="85" rx="15" fill="#FBBF24" stroke="#0F172A" strokeWidth="6"/>
        <path d="M50 55L54.5 64.5L65 66L57.5 73.5L59 84L50 79L41 84L42.5 73.5L35 66L45.5 64.5L50 55Z" fill="#0F172A"/>
      </svg>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-[#0F172A] font-heading font-black text-2xl tracking-tight uppercase italic">Amazing</span>
          <span className="text-amber-500 font-bold text-xs tracking-[0.4em] uppercase ml-1 mt-1">Shop</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
