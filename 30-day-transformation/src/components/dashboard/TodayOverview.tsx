'use client';

import { useTransformationStore } from '@/store/useTransformationStore';
import { todayISO, formatWeight, formatWater } from '@/lib/utils';
import { DAILY_WATER_GOAL } from '@/lib/constants';
import { Scale, Droplets, UtensilsCrossed, Dumbbell } from 'lucide-react';

export default function TodayOverview() {
  const dailyLogs = useTransformationStore((s) => s.dailyLogs);
  const settings = useTransformationStore((s) => s.settings);
  const today = todayISO();
  const log = dailyLogs.find((l) => l.date === today);

  const stats = [
    {
      icon: Scale,
      label: 'Weight',
      value: log?.weight ? formatWeight(log.weight, settings.weightUnit) : '--',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      icon: Droplets,
      label: 'Water',
      value: log ? formatWater(log.waterIntakeMl, settings.waterUnit) : '0',
      sub: `/ ${formatWater(DAILY_WATER_GOAL, settings.waterUnit)}`,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950',
    },
    {
      icon: UtensilsCrossed,
      label: 'Meals',
      value: `${log?.meals.length ?? 0}`,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950',
    },
    {
      icon: Dumbbell,
      label: 'Exercise',
      value: `${log?.exercises.length ?? 0}`,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl p-3 text-center ${stat.bgColor}`}
        >
          <stat.icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
          <p className="text-sm font-bold text-foreground">{stat.value}</p>
          {stat.sub && (
            <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
          )}
          <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
