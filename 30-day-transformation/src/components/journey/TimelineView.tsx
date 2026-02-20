'use client';

import { useRef, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { DailyLog } from '@/types';
import { MILESTONES, TOTAL_JOURNEY_DAYS } from '@/lib/constants';
import DayCard from './DayCard';
import { Lock } from 'lucide-react';

const MILESTONE_DAYS = MILESTONES.map((m) => m.day);

interface TimelineViewProps {
  dailyLogs: DailyLog[];
  currentDay: number;
}

export default function TimelineView({ dailyLogs, currentDay }: TimelineViewProps) {
  const todayRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to today on mount
  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Build a map of day -> log for quick lookup
  const logsByDay = useMemo(() => {
    const map = new Map<number, DailyLog>();
    dailyLogs.forEach((log) => map.set(log.day, log));
    return map;
  }, [dailyLogs]);

  // Get the previous day's weight for trend calculation
  const getPreviousWeight = (day: number): number | undefined => {
    for (let d = day - 1; d >= 1; d--) {
      const prevLog = logsByDay.get(d);
      if (prevLog?.weight) return prevLog.weight;
    }
    return undefined;
  };

  // Generate all 30 days
  const days = Array.from({ length: TOTAL_JOURNEY_DAYS }, (_, i) => i + 1);

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-3">
        {days.map((day) => {
          const log = logsByDay.get(day);
          const isToday = day === currentDay;
          const isFuture = day > currentDay;
          const isMilestone = MILESTONE_DAYS.includes(day);

          return (
            <div
              key={day}
              ref={isToday ? todayRef : undefined}
              className="relative pl-10"
            >
              {/* Timeline dot */}
              <div
                className={cn(
                  'absolute left-[13px] top-4 w-[11px] h-[11px] rounded-full border-2 z-10',
                  isToday
                    ? 'bg-accent border-accent ring-4 ring-accent/20'
                    : isFuture
                      ? 'bg-background border-muted-foreground/30'
                      : log?.completed
                        ? 'bg-green-500 border-green-500'
                        : 'bg-muted border-border'
                )}
              />

              {/* Future day placeholder */}
              {isFuture ? (
                <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-3 opacity-50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Day {day}
                      </span>
                      {isMilestone && (
                        <p className="text-[11px] text-amber-500 font-medium">
                          {MILESTONES.find((m) => m.day === day)?.title}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : log ? (
                <DayCard
                  log={log}
                  isToday={isToday}
                  isMilestone={isMilestone}
                  previousWeight={getPreviousWeight(day)}
                />
              ) : (
                <div className="rounded-xl border border-dashed border-border p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {day}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      No data logged
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
