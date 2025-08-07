'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ 
  content, 
  children, 
  className = '', 
  position = 'bottom' 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Handle click outside to close tooltip on touch devices
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    if (isTouchDevice && isVisible) {
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('touchstart', handleClickOutside);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isTouchDevice, isVisible]);

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      timeoutRef.current = setTimeout(() => setIsVisible(false), 100);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isTouchDevice) {
      e.preventDefault();
      e.stopPropagation();
      setIsVisible(!isVisible);
    }
  };

  const handleFocus = () => {
    if (!isTouchDevice) {
      setIsVisible(true);
    }
  };

  const handleBlur = () => {
    if (!isTouchDevice) {
      timeoutRef.current = setTimeout(() => setIsVisible(false), 100);
    }
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div 
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
    >
      {children}
      
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm text-white rounded-lg shadow-xl pointer-events-none ${positionClasses[position]} tooltip-content`}
          style={{ 
            backgroundColor: 'var(--color-brand-k)',
            maxWidth: '280px',
            minWidth: '200px',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: '1.4',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25), 0 4px 10px rgba(0, 0, 0, 0.15)',
          }}
        >
          {content}
          
          {/* Arrow */}
          <div
            className={`absolute w-0 h-0`}
            style={{
              ...(position === 'top' && {
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid var(--color-brand-k)',
              }),
              ...(position === 'bottom' && {
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '6px solid var(--color-brand-k)',
              }),
              ...(position === 'left' && {
                left: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderLeft: '6px solid var(--color-brand-k)',
              }),
              ...(position === 'right' && {
                right: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderRight: '6px solid var(--color-brand-k)',
              }),
            }}
          />
        </div>
      )}
    </div>
  );
}