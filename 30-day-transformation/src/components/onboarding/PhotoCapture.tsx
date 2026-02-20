'use client';

import { useRef, useState } from 'react';
import { Camera, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { compressPhoto } from '@/lib/morphing';
import { PhotoAngle } from '@/types';

interface PhotoCaptureProps {
  angle: PhotoAngle;
  currentPhoto?: string;
  onCapture: (dataUrl: string) => void;
  onRemove: () => void;
}

const ANGLE_LABELS: Record<PhotoAngle, string> = {
  front: 'Front',
  left: 'Left Side',
  right: 'Right Side',
  back: 'Back',
};

const ANGLE_GUIDES: Record<PhotoAngle, string> = {
  front: 'Stand facing the camera, arms relaxed at your sides',
  left: 'Stand with your left side facing the camera',
  right: 'Stand with your right side facing the camera',
  back: 'Stand with your back facing the camera',
};

export default function PhotoCapture({ angle, currentPhoto, onCapture, onRemove }: PhotoCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const compressed = await compressPhoto(file);
      onCapture(compressed);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (currentPhoto) {
    return (
      <div className="relative group">
        <div className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-accent/50">
          <img
            src={currentPhoto}
            alt={`${ANGLE_LABELS[angle]} view`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 bg-black/60 rounded-full text-white hover:bg-red-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-center text-xs font-medium text-foreground mt-2">{ANGLE_LABELS[angle]}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className={cn(
          'aspect-[3/4] w-full rounded-xl border-2 border-dashed border-border',
          'flex flex-col items-center justify-center gap-2 transition-all',
          'hover:border-accent hover:bg-accent/5',
          isLoading && 'opacity-50 cursor-wait'
        )}
      >
        {isLoading ? (
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Camera className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{ANGLE_LABELS[angle]}</span>
            <span className="text-[10px] text-muted-foreground/70 px-4 text-center">{ANGLE_GUIDES[angle]}</span>
          </>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
