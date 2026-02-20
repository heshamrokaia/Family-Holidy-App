'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BREAKING_FAST_PHASES } from '@/lib/meal-data';
import {
  Droplets,
  Soup,
  UtensilsCrossed,
  CheckCircle2,
  Circle,
  Timer,
  Lightbulb,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';

const PHASE_ICONS = [Droplets, Soup, UtensilsCrossed];

const PHASE_COLORS = [
  {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
    accent: 'bg-blue-500',
  },
  {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    accent: 'bg-amber-500',
  },
  {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    accent: 'bg-emerald-500',
  },
];

export default function BreakingFastGuide() {
  const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const togglePhaseComplete = (phase: number) => {
    setCompletedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phase)) {
        next.delete(phase);
      } else {
        next.add(phase);
      }
      return next;
    });
  };

  const startTimer = useCallback(
    (phaseIndex: number) => {
      const phase = BREAKING_FAST_PHASES[phaseIndex];
      if (!phase) return;

      // Set timer to the minimum duration of the next rest period
      const durationSec = phase.durationMinutes.min * 60;
      setActiveTimer(phaseIndex);
      setTimerSeconds(durationSec);
      setIsTimerRunning(true);
    },
    []
  );

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resumeTimer = () => {
    setIsTimerRunning(true);
  };

  const resetTimer = () => {
    setActiveTimer(null);
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  useEffect(() => {
    if (!isTimerRunning || timerSeconds <= 0) {
      if (timerSeconds <= 0 && isTimerRunning) {
        setIsTimerRunning(false);
      }
      return;
    }

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 px-1">
        {BREAKING_FAST_PHASES.map((phase, i) => (
          <div key={phase.phase} className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                'h-1.5 rounded-full flex-1 transition-colors duration-300',
                completedPhases.has(phase.phase)
                  ? PHASE_COLORS[i].accent
                  : 'bg-muted'
              )}
            />
            {i < BREAKING_FAST_PHASES.length - 1 && (
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            )}
          </div>
        ))}
      </div>

      {/* Phase cards */}
      {BREAKING_FAST_PHASES.map((phase, i) => {
        const Icon = PHASE_ICONS[i];
        const colors = PHASE_COLORS[i];
        const isCompleted = completedPhases.has(phase.phase);
        const isTimerActive = activeTimer === i;

        return (
          <Card
            key={phase.phase}
            className={cn(
              'transition-all duration-300',
              isCompleted && 'opacity-75',
              colors.border
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      colors.bg
                    )}
                  >
                    <Icon className={cn('w-5 h-5', colors.text)} />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      Phase {phase.phase}: {phase.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {phase.durationMinutes.min}-{phase.durationMinutes.max} minutes
                    </p>
                  </div>
                </div>

                {/* Phase complete checkbox */}
                <button
                  onClick={() => togglePhaseComplete(phase.phase)}
                  className="p-1 -m-1 transition-colors"
                  aria-label={isCompleted ? 'Mark phase incomplete' : 'Mark phase complete'}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground/40" />
                  )}
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {phase.description}
              </p>

              {/* Suggested foods as chips */}
              <div>
                <p className="text-xs font-medium text-foreground mb-2">
                  Suggested Foods
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {phase.suggestedFoods.map((food) => (
                    <Badge
                      key={food}
                      variant="secondary"
                      className={cn('text-xs font-normal', colors.badge)}
                    >
                      {food}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Nutrition tip */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {phase.nutritionTip}
                </p>
              </div>

              {/* Timer between phases */}
              {i < BREAKING_FAST_PHASES.length - 1 && (
                <div className="pt-2 border-t border-border">
                  {isTimerActive ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Timer
                          className={cn(
                            'w-4 h-4',
                            timerSeconds === 0
                              ? 'text-emerald-500'
                              : colors.text
                          )}
                        />
                        <span
                          className={cn(
                            'text-sm font-mono font-semibold',
                            timerSeconds === 0
                              ? 'text-emerald-500'
                              : 'text-foreground'
                          )}
                        >
                          {timerSeconds === 0
                            ? 'Ready for next phase!'
                            : formatTimer(timerSeconds)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {timerSeconds > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={isTimerRunning ? pauseTimer : resumeTimer}
                          >
                            {isTimerRunning ? (
                              <Pause className="w-3.5 h-3.5" />
                            ) : (
                              <Play className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={resetTimer}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn('w-full text-xs gap-2', colors.text)}
                      onClick={() => startTimer(i)}
                    >
                      <Timer className="w-3.5 h-3.5" />
                      Start {phase.durationMinutes.min} min rest timer before Phase{' '}
                      {phase.phase + 1}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
