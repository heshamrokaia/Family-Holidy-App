'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn, formatCountdown } from '@/lib/utils';
import { getMetabolicPhase, getPhaseLabel } from '@/lib/fasting-science';
import type { FastingSchedule, MetabolicPhase } from '@/types';
import { Moon, Sun } from 'lucide-react';

interface FastingTimerProps {
  schedule: FastingSchedule;
  className?: string;
}

interface TimerState {
  status: 'fasting' | 'eating' | 'pre-suhoor';
  elapsedMs: number;
  remainingMs: number;
  totalMs: number;
  progress: number;
  currentHour: number;
  phase: MetabolicPhase;
}

function computeTimerState(schedule: FastingSchedule, now: Date): TimerState {
  const [startH, startM] = schedule.startTime.split(':').map(Number);
  const [endH, endM] = schedule.endTime.split(':').map(Number);

  const fastStart = new Date(now);
  fastStart.setHours(startH, startM, 0, 0);

  const fastEnd = new Date(now);
  fastEnd.setHours(endH, endM, 0, 0);

  // Handle overnight fasting (if end < start, end is next day)
  if (fastEnd <= fastStart) {
    if (now.getHours() < endH || (now.getHours() === endH && now.getMinutes() < endM)) {
      fastStart.setDate(fastStart.getDate() - 1);
    } else {
      fastEnd.setDate(fastEnd.getDate() + 1);
    }
  }

  const totalMs = fastEnd.getTime() - fastStart.getTime();
  const nowMs = now.getTime();

  if (nowMs >= fastStart.getTime() && nowMs <= fastEnd.getTime()) {
    const elapsedMs = nowMs - fastStart.getTime();
    const remainingMs = fastEnd.getTime() - nowMs;
    const currentHour = elapsedMs / (1000 * 60 * 60);

    return {
      status: 'fasting',
      elapsedMs,
      remainingMs,
      totalMs,
      progress: Math.min(elapsedMs / totalMs, 1),
      currentHour,
      phase: getMetabolicPhase(currentHour),
    };
  }

  // Eating window
  const nextStart = new Date(fastStart);
  if (nowMs > fastEnd.getTime()) {
    nextStart.setDate(nextStart.getDate() + 1);
  }
  const timeUntilFast = nextStart.getTime() - nowMs;
  const preSuhoorThreshold = 30 * 60 * 1000;

  return {
    status: timeUntilFast <= preSuhoorThreshold ? 'pre-suhoor' : 'eating',
    elapsedMs: 0,
    remainingMs: timeUntilFast,
    totalMs,
    progress: 0,
    currentHour: 0,
    phase: 'fed',
  };
}

const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 120;

export default function FastingTimer({ schedule, className }: FastingTimerProps) {
  const [timer, setTimer] = useState<TimerState | null>(null);

  const updateTimer = useCallback(() => {
    setTimer(computeTimerState(schedule, new Date()));
  }, [schedule]);

  useEffect(() => {
    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    const handleVisibility = () => {
      if (!document.hidden) updateTimer();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [updateTimer]);

  if (!timer) return null;

  const isFasting = timer.status === 'fasting';
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - timer.progress);

  const phaseColors: Record<MetabolicPhase, string> = {
    fed: '#f59e0b',
    'early-fasting': '#3b82f6',
    'fat-burning': '#f97316',
    'deep-fasting': '#8b5cf6',
  };

  const ringColor = isFasting ? phaseColors[timer.phase] : '#6b7280';

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* SVG Timer Ring */}
      <div className={cn('relative', isFasting && 'animate-timer-glow')}>
        <svg width="264" height="264" viewBox="0 0 264 264">
          {/* Background ring */}
          <circle
            cx="132"
            cy="132"
            r="120"
            fill="none"
            stroke="var(--border)"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <circle
            cx="132"
            cy="132"
            r="120"
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 132 132)"
            className="transition-all duration-1000"
          />
          {/* Inner glow */}
          {isFasting && (
            <circle
              cx="132"
              cy="132"
              r="100"
              fill="none"
              stroke={ringColor}
              strokeWidth="1"
              opacity="0.2"
            />
          )}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isFasting ? (
            <Moon className="w-5 h-5 text-accent mb-1" />
          ) : (
            <Sun className="w-5 h-5 text-amber-500 mb-1" />
          )}
          <span className="text-3xl font-bold font-mono text-foreground tracking-tight">
            {formatCountdown(timer.remainingMs)}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            {isFasting ? 'remaining' : timer.status === 'pre-suhoor' ? 'until suhoor' : 'until next fast'}
          </span>
        </div>
      </div>

      {/* Status label */}
      <div className="mt-4 flex items-center gap-2">
        <div
          className={cn(
            'w-2 h-2 rounded-full',
            isFasting ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'
          )}
        />
        <span className={cn(
          'text-sm font-semibold',
          isFasting ? 'text-foreground' : 'text-muted-foreground'
        )}>
          {isFasting ? `Fasting - ${getPhaseLabel(timer.phase)}` : timer.status === 'pre-suhoor' ? 'Prepare for Suhoor' : 'Eating Window'}
        </span>
      </div>

      {/* Hour counter */}
      {isFasting && (
        <p className="text-xs text-muted-foreground mt-1">
          Hour {Math.floor(timer.currentHour)} of {Math.round(timer.totalMs / 3600000)}
        </p>
      )}
    </div>
  );
}
