'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { morphImageForDay } from '@/lib/morphing';
import { Sparkles } from 'lucide-react';

const DAY_OPTIONS = [5, 10, 15, 20, 25, 30];

interface PredictedPhotoViewProps {
  sourcePhoto: string;
  day: number;
  totalWeightLossPercent: number;
}

export default function PredictedPhotoView({
  sourcePhoto,
  day: initialDay,
  totalWeightLossPercent,
}: PredictedPhotoViewProps) {
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [isRendering, setIsRendering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const renderMorphedImage = useCallback(() => {
    if (!canvasRef.current || !sourcePhoto) return;

    setIsRendering(true);

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      if (canvasRef.current) {
        morphImageForDay(img, canvasRef.current, selectedDay, totalWeightLossPercent);
      }
      setIsRendering(false);
    };
    img.onerror = () => {
      setIsRendering(false);
    };
    img.src = sourcePhoto;
  }, [sourcePhoto, selectedDay, totalWeightLossPercent]);

  useEffect(() => {
    renderMorphedImage();
  }, [renderMorphedImage]);

  return (
    <div className="space-y-3">
      {/* Canvas display */}
      <div className="relative aspect-[3/4] bg-muted rounded-2xl overflow-hidden">
        <canvas
          ref={canvasRef}
          className={cn(
            'w-full h-full object-contain transition-opacity duration-300',
            isRendering ? 'opacity-50' : 'opacity-100'
          )}
        />

        {/* Predicted label */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Predicted
        </div>

        {/* Day label */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          Day {selectedDay}
        </div>

        {/* Loading overlay */}
        {isRendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/30">
            <div className="animate-pulse w-8 h-8 rounded-full bg-accent/30" />
          </div>
        )}

        {/* No photo placeholder */}
        {!sourcePhoto && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Sparkles className="w-10 h-10 opacity-30" />
            <p className="text-sm font-medium">No source photo</p>
            <p className="text-xs opacity-60">Take a before photo to see predictions</p>
          </div>
        )}
      </div>

      {/* Day selector buttons */}
      <div className="flex items-center justify-center gap-1.5">
        {DAY_OPTIONS.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
              d === selectedDay
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            Day {d}
          </button>
        ))}
      </div>
    </div>
  );
}
