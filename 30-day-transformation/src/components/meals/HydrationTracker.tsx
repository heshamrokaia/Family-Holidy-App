'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, todayISO, formatWater } from '@/lib/utils';
import { useTransformationStore } from '@/store/useTransformationStore';
import { DAILY_WATER_GOAL } from '@/lib/constants';
import { Droplets, GlassWater, Trophy } from 'lucide-react';

const QUICK_ADD_AMOUNTS = [
  { label: '+250ml', value: 250, icon: GlassWater },
  { label: '+500ml', value: 500, icon: GlassWater },
  { label: '+1000ml', value: 1000, icon: Droplets },
];

export default function HydrationTracker() {
  const dailyLogs = useTransformationStore((s) => s.dailyLogs);
  const updateWaterIntake = useTransformationStore((s) => s.updateWaterIntake);
  const getOrCreateDailyLog = useTransformationStore((s) => s.getOrCreateDailyLog);
  const settings = useTransformationStore((s) => s.settings);

  const today = todayISO();

  const todayLog = useMemo(() => {
    return dailyLogs.find((l) => l.date === today);
  }, [dailyLogs, today]);

  const currentIntake = todayLog?.waterIntakeMl ?? 0;
  const goal = todayLog?.waterGoalMl ?? DAILY_WATER_GOAL;
  const percentage = Math.min((currentIntake / goal) * 100, 100);
  const isGoalMet = currentIntake >= goal;

  const handleAddWater = (amount: number) => {
    getOrCreateDailyLog(today);
    const newAmount = currentIntake + amount;
    updateWaterIntake(today, newAmount);
  };

  // SVG gauge constants
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const fillPercentage = Math.min(percentage, 100);
  const dashOffset = circumference - (fillPercentage / 100) * circumference;

  // Water fill wave effect values
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-blue-500" />
              </div>
              <CardTitle className="text-base">Water Intake</CardTitle>
            </div>
            {isGoalMet && (
              <div className="flex items-center gap-1 text-emerald-500">
                <Trophy className="w-4 h-4" />
                <span className="text-xs font-medium">Goal Met!</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Circular gauge */}
          <div className="flex justify-center">
            <div className="relative">
              <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90"
              >
                {/* Background circle */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-muted"
                />

                {/* Water fill circle */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className={cn(
                    'transition-all duration-700 ease-out',
                    isGoalMet ? 'text-emerald-500' : 'text-blue-500'
                  )}
                />
              </svg>

              {/* Inner water fill effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="relative overflow-hidden rounded-full"
                  style={{
                    width: size - strokeWidth * 4,
                    height: size - strokeWidth * 4,
                  }}
                >
                  {/* Water fill background */}
                  <div
                    className={cn(
                      'absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out',
                      isGoalMet
                        ? 'bg-emerald-500/15'
                        : 'bg-blue-500/15'
                    )}
                    style={{
                      height: `${fillPercentage}%`,
                    }}
                  />

                  {/* Wave effect (decorative) */}
                  {fillPercentage > 0 && fillPercentage < 100 && (
                    <svg
                      className="absolute left-0 right-0 w-full"
                      style={{ top: `${100 - fillPercentage - 3}%` }}
                      viewBox="0 0 200 10"
                      preserveAspectRatio="none"
                      height="8"
                    >
                      <path
                        d="M0 5 Q25 0 50 5 T100 5 T150 5 T200 5 V10 H0 Z"
                        className={cn(
                          isGoalMet
                            ? 'fill-emerald-500/15'
                            : 'fill-blue-500/15'
                        )}
                      />
                    </svg>
                  )}

                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <span className="text-3xl font-bold text-foreground">
                      {formatWater(currentIntake, settings.waterUnit)}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      of {formatWater(goal, settings.waterUnit)}
                    </span>
                    <span
                      className={cn(
                        'text-sm font-semibold mt-1',
                        isGoalMet
                          ? 'text-emerald-500'
                          : 'text-blue-500'
                      )}
                    >
                      {Math.round(percentage)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick-add buttons */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground text-center">
              Quick Add
            </p>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_ADD_AMOUNTS.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.value}
                    variant="outline"
                    className="flex flex-col h-auto py-3 gap-1 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => handleAddWater(item.value)}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Hydration tips */}
          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-blue-600 dark:text-blue-400">
                Tip:
              </span>{' '}
              During fasting, aim to drink most of your water between iftar and suhoor.
              Spread intake evenly -- avoid gulping large amounts at once.
              Room temperature water is easier on the stomach.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
