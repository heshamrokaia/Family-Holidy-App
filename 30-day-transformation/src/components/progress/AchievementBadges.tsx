'use client';

import { useTransformationStore } from '@/store/useTransformationStore';
import { getCurrentDay } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { MILESTONES } from '@/lib/constants';
import { Lock, Check } from 'lucide-react';

export default function AchievementBadges() {
  const profile = useTransformationStore((s) => s.userProfile);
  const currentDay = profile.startDate ? getCurrentDay(profile.startDate) : 1;

  return (
    <div className="grid grid-cols-3 gap-3">
      {MILESTONES.map((milestone) => {
        const isUnlocked = currentDay >= milestone.day;

        return (
          <div
            key={milestone.day}
            className={cn(
              'relative flex flex-col items-center text-center rounded-xl p-4 border transition-all',
              isUnlocked
                ? 'bg-card border-accent/30 shadow-sm'
                : 'bg-muted/30 border-border opacity-60 grayscale'
            )}
          >
            {/* Unlocked checkmark */}
            {isUnlocked && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}

            {/* Icon */}
            <div
              className={cn(
                'text-2xl mb-2',
                !isUnlocked && 'opacity-50'
              )}
            >
              {isUnlocked ? (
                <span>{milestone.icon}</span>
              ) : (
                <Lock className="w-6 h-6 text-muted-foreground" />
              )}
            </div>

            {/* Day number */}
            <p
              className={cn(
                'text-[10px] font-semibold uppercase tracking-wide mb-0.5',
                isUnlocked ? 'text-accent' : 'text-muted-foreground'
              )}
            >
              Day {milestone.day}
            </p>

            {/* Title */}
            <p
              className={cn(
                'text-xs font-medium leading-tight',
                isUnlocked ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {milestone.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}
