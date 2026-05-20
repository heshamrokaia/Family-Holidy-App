'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTransformationStore } from '@/store/useTransformationStore';
import { getCurrentDay } from '@/lib/utils';
import { TOTAL_JOURNEY_DAYS } from '@/lib/constants';
import { getMorphedDataUrl } from '@/lib/morphing';
import MobileNav from '@/components/layout/MobileNav';
import PageHeader from '@/components/layout/PageHeader';
import PhotoCarousel360 from '@/components/journey/PhotoCarousel360';
import TransformationSlider from '@/components/journey/TransformationSlider';
import PredictedPhotoView from '@/components/journey/PredictedPhotoView';
import TimelineView from '@/components/journey/TimelineView';
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react';

export default function JourneyPage() {
  const hydrated = useTransformationStore((s) => s.hydrated);
  const profile = useTransformationStore((s) => s.userProfile);
  const bodyPhotos = useTransformationStore((s) => s.bodyPhotos);
  const dailyLogs = useTransformationStore((s) => s.dailyLogs);

  const currentDay = profile.startDate ? getCurrentDay(profile.startDate) : 1;
  const [selectedPhotoDay, setSelectedPhotoDay] = useState(0); // 0 = before photos

  // Find the "before" photo (day 0, front angle) for predictions
  const beforePhoto = useMemo(() => {
    return bodyPhotos.find((p) => p.day === 0 && p.angle === 'front');
  }, [bodyPhotos]);

  // Photos for the selected day in the carousel
  const selectedDayPhotos = useMemo(() => {
    return bodyPhotos.filter((p) => p.day === selectedPhotoDay);
  }, [bodyPhotos, selectedPhotoDay]);

  // All days that have photos
  const daysWithPhotos = useMemo(() => {
    const days = new Set(bodyPhotos.map((p) => p.day));
    return Array.from(days).sort((a, b) => a - b);
  }, [bodyPhotos]);

  // Calculate total weight loss percent for morphing
  const totalWeightLossPercent = useMemo(() => {
    if (profile.startingWeight <= 0) return 5;
    const goalLoss = profile.startingWeight - profile.goalWeight;
    return Math.max(1, Math.min(20, (goalLoss / profile.startingWeight) * 100));
  }, [profile.startingWeight, profile.goalWeight]);

  // Navigation for photo day selector
  const navigatePhotoDay = (direction: 'prev' | 'next') => {
    if (daysWithPhotos.length === 0) return;
    const currentIdx = daysWithPhotos.indexOf(selectedPhotoDay);
    if (direction === 'prev' && currentIdx > 0) {
      setSelectedPhotoDay(daysWithPhotos[currentIdx - 1]);
    } else if (direction === 'next' && currentIdx < daysWithPhotos.length - 1) {
      setSelectedPhotoDay(daysWithPhotos[currentIdx + 1]);
    }
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse w-10 h-10 rounded-full bg-accent/20" />
      </div>
    );
  }

  const hasBeforePhoto = !!beforePhoto;
  const hasAnyPhotos = bodyPhotos.length > 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-6">
        {/* Header */}
        <PageHeader
          title="30-Day Journey"
          subtitle={`Day ${Math.min(currentDay, TOTAL_JOURNEY_DAYS)} of ${TOTAL_JOURNEY_DAYS}`}
          showBack
        />

        {/* === Photo Section === */}
        {hasAnyPhotos ? (
          <div className="space-y-6">
            {/* Photo day selector */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigatePhotoDay('prev')}
                disabled={daysWithPhotos.indexOf(selectedPhotoDay) <= 0}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-foreground">
                {selectedPhotoDay === 0 ? 'Before Photos' : `Day ${selectedPhotoDay} Photos`}
              </span>
              <button
                onClick={() => navigatePhotoDay('next')}
                disabled={
                  daysWithPhotos.indexOf(selectedPhotoDay) >= daysWithPhotos.length - 1
                }
                className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* 360 Photo Carousel */}
            <PhotoCarousel360 photos={selectedDayPhotos} day={selectedPhotoDay} />

            {/* Predicted Photo View */}
            {hasBeforePhoto && (
              <>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Predicted Transformation
                  </h3>
                  <PredictedPhotoView
                    sourcePhoto={beforePhoto.dataUrl}
                    day={currentDay}
                    totalWeightLossPercent={totalWeightLossPercent}
                  />
                </div>

                {/* Before/After Comparison Slider */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Before vs Predicted
                  </h3>
                  <TransformationSliderWithPrediction
                    beforeDataUrl={beforePhoto.dataUrl}
                    currentDay={Math.min(currentDay, TOTAL_JOURNEY_DAYS)}
                    totalWeightLossPercent={totalWeightLossPercent}
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          /* Empty photo state */
          <div className="rounded-2xl border-2 border-dashed border-border bg-muted/30 p-8 text-center">
            <Camera className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground mb-1">No Photos Yet</p>
            <p className="text-xs text-muted-foreground">
              Take your first body photos during onboarding or daily check-in to see your
              transformation journey here.
            </p>
          </div>
        )}

        {/* === Timeline Section === */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4">Timeline</h3>
          <TimelineView dailyLogs={dailyLogs} currentDay={currentDay} />
        </div>
      </div>

      <MobileNav />
    </div>
  );
}

// --- Helper component: TransformationSlider that generates predicted image ---

function TransformationSliderWithPrediction({
  beforeDataUrl,
  currentDay,
  totalWeightLossPercent,
}: {
  beforeDataUrl: string;
  currentDay: number;
  totalWeightLossPercent: number;
}) {
  const [predictedUrl, setPredictedUrl] = useState<string | null>(null);

  // Generate predicted image on mount / day change
  useEffect(() => {
    getMorphedDataUrl(beforeDataUrl, currentDay, totalWeightLossPercent)
      .then(setPredictedUrl)
      .catch(() => setPredictedUrl(null));
  }, [beforeDataUrl, currentDay, totalWeightLossPercent]);

  if (!predictedUrl) {
    return (
      <div className="aspect-[3/4] rounded-2xl bg-muted flex items-center justify-center">
        <div className="animate-pulse w-8 h-8 rounded-full bg-accent/20" />
      </div>
    );
  }

  return (
    <TransformationSlider
      beforeImage={beforeDataUrl}
      afterImage={predictedUrl}
      beforeLabel="Before"
      afterLabel={`Day ${currentDay}`}
    />
  );
}
