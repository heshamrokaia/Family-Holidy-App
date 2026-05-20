'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronsLeftRight } from 'lucide-react';

interface TransformationSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function TransformationSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: TransformationSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getPositionFromEvent = useCallback(
    (clientX: number): number => {
      if (!containerRef.current) return 50;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      return Math.max(0, Math.min(100, percentage));
    },
    []
  );

  // --- Touch handlers ---

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      setSliderPosition(getPositionFromEvent(e.touches[0].clientX));
    },
    [getPositionFromEvent]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      setSliderPosition(getPositionFromEvent(e.touches[0].clientX));
    },
    [isDragging, getPositionFromEvent]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // --- Mouse handlers ---

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      setSliderPosition(getPositionFromEvent(e.clientX));
    },
    [getPositionFromEvent]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setSliderPosition(getPositionFromEvent(e.clientX));
    },
    [isDragging, getPositionFromEvent]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) setIsDragging(false);
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-col-resize select-none bg-muted"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* After image (full background) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            width: containerRef.current
              ? `${containerRef.current.offsetWidth}px`
              : '100%',
            maxWidth: 'none',
          }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* Handle */}
        <div
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-10 h-10 rounded-full bg-white shadow-xl',
            'flex items-center justify-center',
            'transition-transform',
            isDragging && 'scale-110'
          )}
        >
          <ChevronsLeftRight className="w-5 h-5 text-gray-700" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
        {beforeLabel}
      </div>
      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
        {afterLabel}
      </div>
    </div>
  );
}
