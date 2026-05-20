'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DATES_NUTRITION } from '@/lib/constants';
import {
  Flame,
  Wheat,
  Leaf,
  Candy,
  Beef,
  Droplet,
  Zap,
  Heart,
  Shield,
  CheckCircle2,
} from 'lucide-react';

const MACRO_ITEMS = [
  {
    label: 'Calories',
    value: `${DATES_NUTRITION.per100g.calories}`,
    unit: 'kcal',
    icon: Flame,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    label: 'Carbs',
    value: `${DATES_NUTRITION.per100g.carbs}`,
    unit: 'g',
    icon: Wheat,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    label: 'Fiber',
    value: `${DATES_NUTRITION.per100g.fiber}`,
    unit: 'g',
    icon: Leaf,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    label: 'Sugar',
    value: `${DATES_NUTRITION.per100g.sugar}`,
    unit: 'g',
    icon: Candy,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
  },
  {
    label: 'Protein',
    value: `${DATES_NUTRITION.per100g.protein}`,
    unit: 'g',
    icon: Beef,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    label: 'Fat',
    value: `${DATES_NUTRITION.per100g.fat}`,
    unit: 'g',
    icon: Droplet,
    color: 'text-yellow-600',
    bg: 'bg-yellow-500/10',
  },
];

const MINERAL_ITEMS = [
  {
    label: 'Potassium',
    value: `${DATES_NUTRITION.per100g.potassium}`,
    unit: 'mg',
    icon: Zap,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    label: 'Magnesium',
    value: `${DATES_NUTRITION.per100g.magnesium}`,
    unit: 'mg',
    icon: Heart,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    label: 'Iron',
    value: `${DATES_NUTRITION.per100g.iron}`,
    unit: 'mg',
    icon: Shield,
    color: 'text-slate-500',
    bg: 'bg-slate-500/10',
  },
];

export default function NutritionInfoCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{DATES_NUTRITION.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Nutritional values per 100g
            </p>
          </div>
          <Badge
            variant="outline"
            className="text-xs font-normal border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
          >
            GI: {DATES_NUTRITION.glycemicIndex}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Macros grid */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Macronutrients
          </p>
          <div className="grid grid-cols-3 gap-2">
            {MACRO_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center p-2.5 rounded-lg bg-muted/50"
                >
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center mb-1.5',
                      item.bg
                    )}
                  >
                    <Icon className={cn('w-3.5 h-3.5', item.color)} />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {item.value}
                    <span className="text-xs font-normal text-muted-foreground ml-0.5">
                      {item.unit}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Minerals */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Key Minerals
          </p>
          <div className="grid grid-cols-3 gap-2">
            {MINERAL_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center p-2.5 rounded-lg bg-muted/50"
                >
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center mb-1.5',
                      item.bg
                    )}
                  >
                    <Icon className={cn('w-3.5 h-3.5', item.color)} />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {item.value}
                    <span className="text-xs font-normal text-muted-foreground ml-0.5">
                      {item.unit}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Benefits for Breaking Fast
          </p>
          <div className="space-y-1.5">
            {DATES_NUTRITION.benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
