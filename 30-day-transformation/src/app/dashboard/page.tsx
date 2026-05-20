'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTransformationStore } from '@/store/useTransformationStore';
import { getCurrentDay, todayISO } from '@/lib/utils';

import MobileNav from '@/components/layout/MobileNav';
import PageHeader from '@/components/layout/PageHeader';
import FastingTimer from '@/components/dashboard/FastingTimer';
import HourlyTimeline from '@/components/dashboard/HourlyTimeline';
import MetabolicStateCard from '@/components/dashboard/MetabolicStateCard';
import TodayOverview from '@/components/dashboard/TodayOverview';
import DailyCheckIn from '@/components/dashboard/DailyCheckIn';
import MotivationBanner from '@/components/dashboard/MotivationBanner';
import { TOTAL_JOURNEY_DAYS } from '@/lib/constants';

export default function DashboardPage() {
  const hydrated = useTransformationStore((s) => s.hydrated);
  const profile = useTransformationStore((s) => s.userProfile);
  const schedule = useTransformationStore((s) => s.fastingSchedule);
  const settings = useTransformationStore((s) => s.settings);
  const getOrCreateDailyLog = useTransformationStore((s) => s.getOrCreateDailyLog);

  const [currentHour, setCurrentHour] = useState(0);
  const [isFasting, setIsFasting] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);

  const day = profile.startDate ? getCurrentDay(profile.startDate) : 1;

  // Compute fasting state
  const computeFastingState = useCallback(() => {
    const now = new Date();
    const [startH, startM] = schedule.startTime.split(':').map(Number);
    const [endH, endM] = schedule.endTime.split(':').map(Number);

    const fastStart = new Date(now);
    fastStart.setHours(startH, startM, 0, 0);
    const fastEnd = new Date(now);
    fastEnd.setHours(endH, endM, 0, 0);

    if (fastEnd <= fastStart) {
      if (now.getHours() < endH || (now.getHours() === endH && now.getMinutes() < endM)) {
        fastStart.setDate(fastStart.getDate() - 1);
      } else {
        fastEnd.setDate(fastEnd.getDate() + 1);
      }
    }

    const nowMs = now.getTime();
    if (nowMs >= fastStart.getTime() && nowMs <= fastEnd.getTime()) {
      const elapsed = (nowMs - fastStart.getTime()) / (1000 * 60 * 60);
      setCurrentHour(elapsed);
      setIsFasting(true);
    } else {
      setCurrentHour(0);
      setIsFasting(false);
    }
  }, [schedule]);

  useEffect(() => {
    computeFastingState();
    const interval = setInterval(computeFastingState, 5000);
    return () => clearInterval(interval);
  }, [computeFastingState]);

  // Ensure today's log exists
  useEffect(() => {
    if (hydrated) {
      getOrCreateDailyLog(todayISO());
    }
  }, [hydrated, getOrCreateDailyLog]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse w-10 h-10 rounded-full bg-accent/20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-4">
        <PageHeader
          title={`Day ${Math.min(day, TOTAL_JOURNEY_DAYS)} of ${TOTAL_JOURNEY_DAYS}`}
          subtitle={profile.name ? `Welcome back, ${profile.name}` : undefined}
        />

        {/* Fasting Timer */}
        <FastingTimer schedule={schedule} />

        {/* Metabolic State */}
        <MetabolicStateCard currentHour={currentHour} isFasting={isFasting} />

        {/* Hourly Timeline */}
        <HourlyTimeline currentHour={currentHour} isFasting={isFasting} />

        {/* Today's Overview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">Today</h3>
            <button
              onClick={() => setShowCheckIn(!showCheckIn)}
              className="text-xs text-accent font-medium"
            >
              {showCheckIn ? 'Hide' : 'Log Check-in'}
            </button>
          </div>
          <TodayOverview />
        </div>

        {/* Daily Check-in (expandable) */}
        {showCheckIn && (
          <div className="animate-slide-up">
            <DailyCheckIn onClose={() => setShowCheckIn(false)} />
          </div>
        )}

        {/* Motivation */}
        <MotivationBanner day={day} mode={settings.mode} />
      </div>

      <MobileNav />
    </div>
  );
}
