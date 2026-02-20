'use client';

import { useMemo } from 'react';
import { useTransformationStore } from '@/store/useTransformationStore';
import { getMealsByDiet } from '@/lib/meal-data';
import MobileNav from '@/components/layout/MobileNav';
import PageHeader from '@/components/layout/PageHeader';
import BreakingFastGuide from '@/components/meals/BreakingFastGuide';
import NutritionInfoCard from '@/components/meals/NutritionInfoCard';
import PlateComposition from '@/components/meals/PlateComposition';
import MealLogger from '@/components/meals/MealLogger';
import HydrationTracker from '@/components/meals/HydrationTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MealTemplate } from '@/types';
import {
  UtensilsCrossed,
  GlassWater,
  Clock,
  Flame,
  ChefHat,
} from 'lucide-react';

function MealSuggestionCard({ meal }: { meal: MealTemplate }) {
  return (
    <div className="p-3 rounded-lg bg-muted/50 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{meal.imageEmoji}</span>
          <div>
            <h4 className="text-sm font-medium text-foreground">{meal.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" />
                <span className="text-xs text-muted-foreground">
                  {meal.calories} cal
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-muted-foreground">
                  {meal.prepTimeMinutes} min
                </span>
              </div>
            </div>
          </div>
        </div>
        {meal.phase && (
          <Badge
            variant="secondary"
            className="text-xs font-normal bg-accent/10 text-accent shrink-0"
          >
            Phase {meal.phase}
          </Badge>
        )}
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-1.5 rounded bg-background">
          <span className="text-xs font-semibold text-foreground">
            {meal.protein}g
          </span>
          <p className="text-[10px] text-muted-foreground">Protein</p>
        </div>
        <div className="text-center p-1.5 rounded bg-background">
          <span className="text-xs font-semibold text-foreground">
            {meal.carbs}g
          </span>
          <p className="text-[10px] text-muted-foreground">Carbs</p>
        </div>
        <div className="text-center p-1.5 rounded bg-background">
          <span className="text-xs font-semibold text-foreground">
            {meal.fat}g
          </span>
          <p className="text-[10px] text-muted-foreground">Fat</p>
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1">
          Ingredients
        </p>
        <div className="flex flex-wrap gap-1">
          {meal.ingredients.map((ingredient) => (
            <Badge
              key={ingredient}
              variant="outline"
              className="text-[10px] font-normal py-0"
            >
              {ingredient}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MealsPage() {
  const hydrated = useTransformationStore((s) => s.hydrated);
  const profile = useTransformationStore((s) => s.userProfile);

  const mealSuggestions = useMemo(() => {
    return getMealsByDiet(profile.dietPreference);
  }, [profile.dietPreference]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse w-10 h-10 rounded-full bg-accent/20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-4">
        <PageHeader
          title="Nutrition"
          subtitle="Fuel your transformation"
        />

        <Tabs defaultValue="breaking-fast" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="breaking-fast" className="text-xs gap-1">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              Breaking Fast
            </TabsTrigger>
            <TabsTrigger value="meal-plan" className="text-xs gap-1">
              <ChefHat className="w-3.5 h-3.5" />
              Meal Plan
            </TabsTrigger>
            <TabsTrigger value="hydration" className="text-xs gap-1">
              <GlassWater className="w-3.5 h-3.5" />
              Hydration
            </TabsTrigger>
          </TabsList>

          {/* Breaking Fast Tab */}
          <TabsContent value="breaking-fast" className="space-y-4 mt-4">
            <BreakingFastGuide />
            <NutritionInfoCard />
            <PlateComposition />
          </TabsContent>

          {/* Meal Plan Tab */}
          <TabsContent value="meal-plan" className="space-y-4 mt-4">
            <MealLogger />

            {/* Suhoor Suggestions */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <span className="text-sm">🌙</span>
                  </div>
                  <div>
                    <CardTitle className="text-base">Suhoor Ideas</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Slow-digesting, high-protein pre-dawn meals
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mealSuggestions.suhoor.map((meal) => (
                  <MealSuggestionCard key={meal.id} meal={meal} />
                ))}
              </CardContent>
            </Card>

            {/* Iftar Suggestions */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <span className="text-sm">🌅</span>
                  </div>
                  <div>
                    <CardTitle className="text-base">Iftar Ideas</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Balanced meals for breaking your fast
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mealSuggestions.iftar.map((meal) => (
                  <MealSuggestionCard key={meal.id} meal={meal} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hydration Tab */}
          <TabsContent value="hydration" className="space-y-4 mt-4">
            <HydrationTracker />
          </TabsContent>
        </Tabs>
      </div>

      <MobileNav />
    </div>
  );
}
