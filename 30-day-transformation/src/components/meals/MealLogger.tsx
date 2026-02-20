'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn, todayISO } from '@/lib/utils';
import { useTransformationStore } from '@/store/useTransformationStore';
import type { MealEntry } from '@/types';
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  Moon,
  Sun,
  Cookie,
  Clock,
  Flame,
} from 'lucide-react';

type MealType = 'suhoor' | 'iftar' | 'snack';
type PhaseNumber = 1 | 2 | 3;

const MEAL_TYPES: { value: MealType; label: string; icon: typeof Sun }[] = [
  { value: 'suhoor', label: 'Suhoor', icon: Moon },
  { value: 'iftar', label: 'Iftar', icon: Sun },
  { value: 'snack', label: 'Snack', icon: Cookie },
];

const IFTAR_PHASES: { value: PhaseNumber; label: string }[] = [
  { value: 1, label: 'Phase 1 - Dates & Water' },
  { value: 2, label: 'Phase 2 - Soup/Broth' },
  { value: 3, label: 'Phase 3 - Main Meal' },
];

const MEAL_TYPE_COLORS: Record<MealType, string> = {
  suhoor: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300',
  iftar: 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
  snack: 'bg-pink-500/15 text-pink-700 dark:text-pink-300',
};

export default function MealLogger() {
  const addMeal = useTransformationStore((s) => s.addMeal);
  const removeMeal = useTransformationStore((s) => s.removeMeal);
  const dailyLogs = useTransformationStore((s) => s.dailyLogs);
  const getOrCreateDailyLog = useTransformationStore((s) => s.getOrCreateDailyLog);

  const today = todayISO();

  const [mealType, setMealType] = useState<MealType>('iftar');
  const [phase, setPhase] = useState<PhaseNumber>(1);
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');

  const todayLog = useMemo(() => {
    return dailyLogs.find((l) => l.date === today);
  }, [dailyLogs, today]);

  const todayMeals = todayLog?.meals ?? [];

  const handleSave = () => {
    if (!description.trim()) return;

    getOrCreateDailyLog(today);

    const meal: Omit<MealEntry, 'id'> = {
      type: mealType,
      description: description.trim(),
      phase: mealType === 'iftar' ? phase : undefined,
      calories: calories ? parseInt(calories, 10) : undefined,
      timestamp: new Date().toISOString(),
    };

    addMeal(today, meal);

    // Reset form
    setDescription('');
    setCalories('');
  };

  const handleRemoveMeal = (mealId: string) => {
    removeMeal(today, mealId);
  };

  const totalCalories = todayMeals.reduce(
    (sum, m) => sum + (m.calories ?? 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Meal logging form */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Plus className="w-4 h-4 text-orange-500" />
            </div>
            <CardTitle className="text-base">Log a Meal</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Meal type selector */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Meal Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {MEAL_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = mealType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => setMealType(type.value)}
                    className={cn(
                      'flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
                      isSelected
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border bg-background text-muted-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phase selector (only for iftar) */}
          {mealType === 'iftar' && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Iftar Phase
              </label>
              <div className="space-y-1.5">
                {IFTAR_PHASES.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPhase(p.value)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors text-left',
                      phase === p.value
                        ? 'border-accent bg-accent/10 text-accent font-medium'
                        : 'border-border bg-background text-muted-foreground hover:bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                        phase === p.value
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {p.value}
                    </span>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Description
            </label>
            <Input
              placeholder="What did you eat?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
              }}
            />
          </div>

          {/* Calories (optional) */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Calories (optional)
            </label>
            <Input
              type="number"
              placeholder="e.g. 350"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              min={0}
              max={5000}
            />
          </div>

          {/* Save button */}
          <Button
            onClick={handleSave}
            disabled={!description.trim()}
            className="w-full gap-2"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Save Meal
          </Button>
        </CardContent>
      </Card>

      {/* Today's logged meals */}
      {todayMeals.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Today&apos;s Meals</CardTitle>
              {totalCalories > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span className="font-medium">{totalCalories} cal</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            {todayMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="secondary"
                      className={cn(
                        'text-xs font-normal',
                        MEAL_TYPE_COLORS[meal.type]
                      )}
                    >
                      {meal.type === 'suhoor'
                        ? 'Suhoor'
                        : meal.type === 'iftar'
                        ? `Iftar${meal.phase ? ` P${meal.phase}` : ''}`
                        : 'Snack'}
                    </Badge>
                    {meal.calories && (
                      <span className="text-xs text-muted-foreground">
                        {meal.calories} cal
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{meal.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(meal.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveMeal(meal.id)}
                  className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  aria-label="Remove meal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
