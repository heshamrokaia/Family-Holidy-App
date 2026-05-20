'use client';

import { useTransformationStore } from '@/store/useTransformationStore';
import { getCurrentDay } from '@/lib/utils';
import { Scale, Flame, CalendarCheck, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCard {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export default function StatsGrid() {
  const profile = useTransformationStore((s) => s.userProfile);
  const dailyLogs = useTransformationStore((s) => s.dailyLogs);

  const currentDay = profile.startDate ? getCurrentDay(profile.startDate) : 1;

  // Total weight lost
  const latestWeightLog = [...dailyLogs]
    .filter((l) => l.weight)
    .sort((a, b) => b.day - a.day)[0];
  const currentWeight = latestWeightLog?.weight ?? profile.currentWeight;
  const totalWeightLost = Math.max(0, profile.startingWeight - currentWeight);

  // Fasting streak: count consecutive completed fasting days going backwards from today
  const sortedLogs = [...dailyLogs].sort((a, b) => b.day - a.day);
  let fastingStreak = 0;
  for (const log of sortedLogs) {
    if (log.fastingSession?.completed) {
      fastingStreak++;
    } else if (log.day < currentDay) {
      // Only break streak on past days that are incomplete
      break;
    }
  }

  // Days completed
  const completedDays = dailyLogs.filter((l) => l.completed).length;

  // Adherence rate (% of past days with completed fasting)
  const pastDays = dailyLogs.filter((l) => l.day <= currentDay);
  const fastedDays = pastDays.filter((l) => l.fastingSession?.completed).length;
  const adherenceRate = pastDays.length > 0
    ? Math.round((fastedDays / pastDays.length) * 100)
    : 0;

  const stats: StatCard[] = [
    {
      label: 'Weight Lost',
      value: `${totalWeightLost.toFixed(1)} kg`,
      icon: Scale,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'Fast Streak',
      value: `${fastingStreak} day${fastingStreak !== 1 ? 's' : ''}`,
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      label: 'Days Done',
      value: `${completedDays}`,
      icon: CalendarCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      label: 'Adherence',
      value: `${adherenceRate}%`,
      icon: Target,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            'rounded-xl p-4 flex flex-col items-center text-center',
            stat.bgColor
          )}
        >
          <stat.icon className={cn('w-5 h-5 mb-2', stat.color)} />
          <p className="text-xl font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
