'use client';

import { useState, useCallback } from 'react';
import { useTransformationStore } from '@/store/useTransformationStore';
import { generateBeforeAfterCard } from '@/lib/sharing';
import { getCurrentDay } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, RefreshCw } from 'lucide-react';

interface BeforeAfterCardProps {
  onCardGenerated?: (dataUrl: string) => void;
}

export default function BeforeAfterCard({ onCardGenerated }: BeforeAfterCardProps) {
  const profile = useTransformationStore((s) => s.userProfile);
  const bodyPhotos = useTransformationStore((s) => s.bodyPhotos);
  const dailyLogs = useTransformationStore((s) => s.dailyLogs);

  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentDay = getCurrentDay(profile.startDate);

  // Get before (day 0) and most recent photo
  const beforePhoto = bodyPhotos.find((p) => p.day === 0 && p.angle === 'front');
  const latestPhotos = bodyPhotos
    .filter((p) => p.angle === 'front' && p.day > 0)
    .sort((a, b) => b.day - a.day);
  const afterPhoto = latestPhotos[0] ?? beforePhoto;

  // Calculate weight lost
  const logsWithWeight = dailyLogs
    .filter((l) => l.weight && l.weight > 0)
    .sort((a, b) => b.day - a.day);
  const latestWeight = logsWithWeight[0]?.weight ?? profile.currentWeight;
  const weightLost = Math.max(0, profile.startingWeight - latestWeight);

  const handleGenerate = useCallback(async () => {
    if (!beforePhoto || !afterPhoto) return;
    setIsGenerating(true);
    try {
      const url = await generateBeforeAfterCard(
        beforePhoto.dataUrl,
        afterPhoto.dataUrl,
        {
          weightLost,
          daysCompleted: Math.min(currentDay, 30),
        },
      );
      setCardUrl(url);
      onCardGenerated?.(url);
    } finally {
      setIsGenerating(false);
    }
  }, [beforePhoto, afterPhoto, weightLost, currentDay, onCardGenerated]);

  if (!beforePhoto) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Upload your &quot;before&quot; photos during onboarding to generate
            a transformation card.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {cardUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cardUrl}
            alt="Before and after transformation"
            className="w-full"
          />
          <button
            onClick={handleGenerate}
            className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4 mb-4">
              {/* Before thumbnail */}
              <div className="flex-1 text-center">
                <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden border border-amber-400/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={beforePhoto.dataUrl}
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Day 1</p>
              </div>

              <div className="text-muted-foreground text-lg">→</div>

              {/* After thumbnail */}
              <div className="flex-1 text-center">
                <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden border border-green-400/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={afterPhoto.dataUrl}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Day {Math.min(currentDay, 30)}
                </p>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Transformation Card'
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
