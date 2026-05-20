'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTransformationStore } from '@/store/useTransformationStore';
import { getCurrentDay } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { TOTAL_JOURNEY_DAYS } from '@/lib/constants';
import MobileNav from '@/components/layout/MobileNav';
import PageHeader from '@/components/layout/PageHeader';
import StatsGrid from '@/components/progress/StatsGrid';
import MeasurementsForm from '@/components/progress/MeasurementsForm';
import AchievementBadges from '@/components/progress/AchievementBadges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, Ruler, Trophy, TrendingUp } from 'lucide-react';

// Dynamic import for Recharts (no SSR)
const WeightChart = dynamic(
  () => import('@/components/progress/WeightChart'),
  { ssr: false }
);

export default function ProgressPage() {
  const hydrated = useTransformationStore((s) => s.hydrated);
  const profile = useTransformationStore((s) => s.userProfile);
  const dailyLogs = useTransformationStore((s) => s.dailyLogs);
  const predictions = useTransformationStore((s) => s.weightPredictions);
  const generatePredictions = useTransformationStore((s) => s.generatePredictions);

  const [measurementsOpen, setMeasurementsOpen] = useState(false);

  const currentDay = profile.startDate ? getCurrentDay(profile.startDate) : 1;

  // Ensure predictions exist
  useEffect(() => {
    if (hydrated && predictions.length === 0) {
      generatePredictions();
    }
  }, [hydrated, predictions.length, generatePredictions]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse w-10 h-10 rounded-full bg-accent/20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5">
        {/* Header */}
        <PageHeader
          title="Progress"
          subtitle={`Day ${Math.min(currentDay, TOTAL_JOURNEY_DAYS)} of ${TOTAL_JOURNEY_DAYS}`}
        />

        {/* Stats Grid */}
        <StatsGrid />

        {/* Weight Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Weight Trajectory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WeightChart
              dailyLogs={dailyLogs}
              predictions={predictions}
              startingWeight={profile.startingWeight}
              goalWeight={profile.goalWeight}
            />
          </CardContent>
        </Card>

        {/* Measurements Form (expandable) */}
        <Card>
          <button
            onClick={() => setMeasurementsOpen(!measurementsOpen)}
            className="w-full"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-amber-500" />
                  Body Measurements
                </CardTitle>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-muted-foreground transition-transform',
                    measurementsOpen && 'rotate-180'
                  )}
                />
              </div>
            </CardHeader>
          </button>
          {measurementsOpen && (
            <CardContent className="animate-in slide-in-from-top-2 duration-200">
              <MeasurementsForm />
            </CardContent>
          )}
        </Card>

        {/* Achievement Badges */}
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Milestones
          </h3>
          <AchievementBadges />
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
