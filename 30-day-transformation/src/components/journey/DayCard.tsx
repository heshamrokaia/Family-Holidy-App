'use client';

import { cn, formatDate, formatWeight } from '@/lib/utils';
import { DailyLog } from '@/types';
import {
  CheckCircle2,
  Dumbbell,
  UtensilsCrossed,
  Scale,
  TrendingDown,
  TrendingUp,
  Minus,
  Camera,
  Star,
} from 'lucide-react';

interface DayCardProps {
  log: DailyLog;
  isToday: boolean;
  isMilestone: boolean;
  previousWeight?: number;
}

export default function DayCard({ log, isToday, isMilestone, previousWeight }: DayCardProps) {
  const fastingCompleted = log.fastingSession?.completed ?? false;
  const hasExercise = log.exercises.length > 0;
  const mealsCount = log.meals.length;
  const hasPhotos = log.photos.length > 0;

  // Weight trend
  let weightTrend: 'down' | 'up' | 'same' | null = null;
  if (log.weight && previousWeight) {
    if (log.weight < previousWeight) weightTrend = 'down';
    else if (log.weight > previousWeight) weightTrend = 'up';
    else weightTrend = 'same';
  }

  const TrendIcon =
    weightTrend === 'down'
      ? TrendingDown
      : weightTrend === 'up'
        ? TrendingUp
        : Minus;

  const trendColor =
    weightTrend === 'down'
      ? 'text-green-500'
      : weightTrend === 'up'
        ? 'text-red-400'
        : 'text-muted-foreground';

  return (
    <div
      className={cn(
        'relative rounded-xl border p-3 transition-all',
        isToday
          ? 'border-accent bg-accent/5 shadow-sm ring-1 ring-accent/20'
          : 'border-border bg-card',
        isMilestone && 'border-amber-400/50 bg-amber-50/30 dark:bg-amber-950/20'
      )}
    >
      {/* Milestone star */}
      {isMilestone && (
        <div className="absolute -top-1.5 -right-1.5 bg-amber-400 text-white rounded-full p-0.5">
          <Star className="w-3 h-3 fill-current" />
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        {/* Left: Day info */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Day number circle */}
          <div
            className={cn(
              'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold',
              isToday
                ? 'bg-accent text-white'
                : log.completed
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                  : 'bg-muted text-muted-foreground'
            )}
          >
            {log.day}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={cn('text-sm font-semibold', isToday && 'text-accent')}>
                {isToday ? 'Today' : `Day ${log.day}`}
              </span>
              {isToday && (
                <span className="text-[10px] bg-accent text-white px-1.5 py-0.5 rounded-full font-medium">
                  NOW
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">{formatDate(log.date)}</p>
          </div>
        </div>

        {/* Right: Weight */}
        {log.weight && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <Scale className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm font-semibold">{formatWeight(log.weight)}</span>
            {weightTrend && (
              <TrendIcon className={cn('w-3.5 h-3.5', trendColor)} />
            )}
          </div>
        )}
      </div>

      {/* Status badges */}
      <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
        {/* Fasting */}
        <div
          className={cn(
            'flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium',
            fastingCompleted
              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
              : 'bg-muted text-muted-foreground'
          )}
        >
          <CheckCircle2 className="w-3 h-3" />
          Fast
        </div>

        {/* Exercise */}
        {hasExercise && (
          <div className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
            <Dumbbell className="w-3 h-3" />
            {log.exercises.length}
          </div>
        )}

        {/* Meals */}
        {mealsCount > 0 && (
          <div className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            <UtensilsCrossed className="w-3 h-3" />
            {mealsCount}
          </div>
        )}

        {/* Photos */}
        {hasPhotos && (
          <div className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400">
            <Camera className="w-3 h-3" />
            {log.photos.length}
          </div>
        )}
      </div>

      {/* Mini photo thumbnail */}
      {hasPhotos && (
        <div className="flex gap-1.5 mt-2.5">
          {log.photos.slice(0, 4).map((photo) => (
            <div
              key={photo.id}
              className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0"
            >
              <img
                src={photo.dataUrl}
                alt={`${photo.angle} photo`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
