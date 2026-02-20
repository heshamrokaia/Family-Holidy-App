'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { HOURLY_BENEFITS } from '@/lib/fasting-science';
import * as LucideIcons from 'lucide-react';

interface HourlyTimelineProps {
  currentHour: number;
  isFasting: boolean;
}

export default function HourlyTimeline({ currentHour, isFasting }: HourlyTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const active = activeRef.current;
      const scrollLeft = active.offsetLeft - container.clientWidth / 2 + active.clientWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [currentHour]);

  const currentHourFloor = Math.floor(currentHour);

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Hour-by-Hour Benefits</h3>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
      >
        {HOURLY_BENEFITS.map((benefit) => {
          const isActive = isFasting && benefit.hour === currentHourFloor;
          const isPast = isFasting && benefit.hour < currentHourFloor;
          const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[benefit.icon];

          return (
            <div
              key={benefit.hour}
              ref={isActive ? activeRef : undefined}
              className={cn(
                'flex-shrink-0 w-28 rounded-xl p-3 border transition-all',
                isActive
                  ? 'border-accent bg-accent/10 ring-2 ring-accent/20'
                  : isPast
                  ? 'border-border bg-card opacity-70'
                  : 'border-border bg-card opacity-40'
              )}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className={cn(
                  'text-xs font-bold',
                  isActive ? 'text-accent' : 'text-muted-foreground'
                )}>
                  H{benefit.hour}
                </span>
                {IconComponent && (
                  <IconComponent className={cn('w-3.5 h-3.5', benefit.color)} />
                )}
              </div>
              <p className={cn(
                'text-[11px] font-medium leading-tight',
                isActive ? 'text-foreground' : 'text-foreground/80'
              )}>
                {benefit.title}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight line-clamp-2">
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
