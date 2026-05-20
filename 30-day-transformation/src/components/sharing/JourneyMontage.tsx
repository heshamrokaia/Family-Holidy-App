'use client';

import { useState, useCallback } from 'react';
import { useTransformationStore } from '@/store/useTransformationStore';
import { downloadImage } from '@/lib/sharing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Images, Loader2, Download } from 'lucide-react';

export default function JourneyMontage() {
  const bodyPhotos = useTransformationStore((s) => s.bodyPhotos);
  const profile = useTransformationStore((s) => s.userProfile);

  const [montageUrl, setMontageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Get front-facing photos sorted by day
  const frontPhotos = bodyPhotos
    .filter((p) => p.angle === 'front')
    .sort((a, b) => a.day - b.day);

  const generateMontage = useCallback(async () => {
    if (frontPhotos.length < 2) return;
    setIsGenerating(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d')!;

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1920);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('My 30-Day Journey', 540, 90);

      ctx.font = '22px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(profile.name || 'Transformation', 540, 130);

      // Calculate grid layout
      const photosToShow = frontPhotos.slice(0, 6); // Max 6 photos
      const cols = photosToShow.length <= 3 ? photosToShow.length : 3;
      const rows = Math.ceil(photosToShow.length / cols);
      const padding = 20;
      const gridTop = 170;
      const availableWidth = 1080 - padding * 2;
      const availableHeight = 1920 - gridTop - 200;
      const cellWidth = (availableWidth - (cols - 1) * 12) / cols;
      const cellHeight = (availableHeight - (rows - 1) * 12) / rows;

      // Load all images
      const images = await Promise.all(
        photosToShow.map(
          (photo) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = reject;
              img.src = photo.dataUrl;
            }),
        ),
      );

      // Draw photos in grid
      photosToShow.forEach((photo, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = padding + col * (cellWidth + 12);
        const y = gridTop + row * (cellHeight + 12);

        ctx.save();
        // Rounded corners
        ctx.beginPath();
        ctx.roundRect(x, y, cellWidth, cellHeight, 12);
        ctx.clip();
        ctx.drawImage(images[i], x, y, cellWidth, cellHeight);
        ctx.restore();

        // Day label
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.beginPath();
        ctx.roundRect(x + 8, y + cellHeight - 40, 80, 32, 8);
        ctx.fill();

        ctx.font = 'bold 18px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText(`Day ${photo.day}`, x + 18, y + cellHeight - 18);
      });

      // Watermark
      ctx.font = '18px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.textAlign = 'center';
      ctx.fillText('30-Day Transformation App', 540, 1890);

      const url = canvas.toDataURL('image/jpeg', 0.9);
      setMontageUrl(url);
    } finally {
      setIsGenerating(false);
    }
  }, [frontPhotos, profile.name]);

  if (frontPhotos.length < 2) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Images className="w-4 h-4 text-purple-500" />
          Journey Montage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {montageUrl ? (
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={montageUrl}
                alt="Journey montage"
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={generateMontage} variant="outline" size="sm">
                Regenerate
              </Button>
              <Button
                onClick={() =>
                  downloadImage(montageUrl, 'journey-montage.jpg')
                }
                size="sm"
                className="flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              Create a montage of {frontPhotos.length} photos showing your journey
              from Day {frontPhotos[0].day} to Day{' '}
              {frontPhotos[frontPhotos.length - 1].day}.
            </p>
            <Button
              onClick={generateMontage}
              disabled={isGenerating}
              className="w-full"
              size="sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Create Montage'
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
