'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { BodyPhoto, PhotoAngle } from '@/types';
import { Camera, RotateCcw } from 'lucide-react';

const ANGLE_ORDER: PhotoAngle[] = ['front', 'right', 'back', 'left'];
const ANGLE_LABELS: Record<PhotoAngle, string> = {
  front: 'Front',
  right: 'Right',
  back: 'Back',
  left: 'Left',
};

const DRAG_THRESHOLD = 80;

interface PhotoCarousel360Props {
  photos: BodyPhoto[];
  day: number;
}

export default function PhotoCarousel360({ photos, day }: PhotoCarousel360Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentAngle = ANGLE_ORDER[currentIndex];

  const getPhotoForAngle = useCallback(
    (angle: PhotoAngle): BodyPhoto | undefined => {
      return photos.find((p) => p.angle === angle);
    },
    [photos]
  );

  // --- Touch handlers ---

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
    setDragOffset(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startXRef.current;
    setDragOffset(diff);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragOffset) >= DRAG_THRESHOLD) {
      if (dragOffset < 0) {
        // Swipe left -> next angle
        setCurrentIndex((prev) => (prev + 1) % ANGLE_ORDER.length);
      } else {
        // Swipe right -> previous angle
        setCurrentIndex((prev) => (prev - 1 + ANGLE_ORDER.length) % ANGLE_ORDER.length);
      }
    }

    setDragOffset(0);
  }, [isDragging, dragOffset]);

  // --- Mouse handlers (desktop) ---

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    setIsDragging(true);
    setDragOffset(0);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const diff = e.clientX - startXRef.current;
      setDragOffset(diff);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragOffset) >= DRAG_THRESHOLD) {
      if (dragOffset < 0) {
        setCurrentIndex((prev) => (prev + 1) % ANGLE_ORDER.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + ANGLE_ORDER.length) % ANGLE_ORDER.length);
      }
    }

    setDragOffset(0);
  }, [isDragging, dragOffset]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset(0);
    }
  }, [isDragging]);

  const currentPhoto = getPhotoForAngle(currentAngle);

  // Compute a subtle transform while dragging
  const dragTranslateX = isDragging ? Math.max(-60, Math.min(60, dragOffset * 0.3)) : 0;

  return (
    <div className="space-y-3">
      {/* Photo viewer */}
      <div
        ref={containerRef}
        className="relative aspect-[3/4] bg-muted rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {currentPhoto ? (
          <img
            src={currentPhoto.dataUrl}
            alt={`Day ${day} - ${ANGLE_LABELS[currentAngle]}`}
            className={cn(
              'w-full h-full object-cover transition-transform',
              !isDragging && 'duration-300 ease-out'
            )}
            style={{
              transform: `translateX(${dragTranslateX}px)`,
            }}
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
            <Camera className="w-12 h-12 opacity-30" />
            <p className="text-sm font-medium">No {ANGLE_LABELS[currentAngle]} Photo</p>
            <p className="text-xs opacity-60">Day {day}</p>
          </div>
        )}

        {/* Day label */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          Day {day}
        </div>

        {/* Drag hint */}
        <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white/80 text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
          <RotateCcw className="w-3 h-3" />
          Drag to rotate
        </div>
      </div>

      {/* Angle indicator */}
      <div className="flex items-center justify-center gap-1.5">
        {ANGLE_ORDER.map((angle, idx) => (
          <button
            key={angle}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              idx === currentIndex
                ? 'bg-accent text-white shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {ANGLE_LABELS[angle]}
          </button>
        ))}
      </div>
    </div>
  );
}
