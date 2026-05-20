'use client';

import { cn } from '@/lib/utils';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = ['Profile', 'Goals', 'Schedule', 'Diet', 'Photos'];

export default function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                i < currentStep
                  ? 'bg-accent text-accent-foreground'
                  : i === currentStep
                  ? 'bg-accent text-accent-foreground ring-4 ring-accent/20'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span className={cn(
              'text-[10px] mt-1 font-medium',
              i <= currentStep ? 'text-foreground' : 'text-muted-foreground'
            )}>
              {STEP_LABELS[i]}
            </span>
          </div>
          {i < totalSteps - 1 && (
            <div
              className={cn(
                'w-8 h-0.5 mb-4',
                i < currentStep ? 'bg-accent' : 'bg-muted'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
