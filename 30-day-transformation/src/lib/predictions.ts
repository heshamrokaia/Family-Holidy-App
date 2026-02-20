import { UserProfile, WeightPrediction, Gender, DietPreference, ExerciseLevel } from '@/types';

function calculateBMR(weight: number, height: number, age: number, gender: Gender): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

function getActivityMultiplier(level: ExerciseLevel): number {
  const multipliers: Record<ExerciseLevel, number> = {
    none: 1.2,
    light: 1.375,
    moderate: 1.55,
    intense: 1.725,
  };
  return multipliers[level];
}

function getDietFactor(diet: DietPreference): number {
  const factors: Record<DietPreference, number> = {
    'minimal-carbs': 1.15, // bonus from water weight + ketosis
    balanced: 1.0,
    custom: 1.0,
  };
  return factors[diet];
}

function estimateInitialBodyFatPercent(weight: number, height: number, age: number, gender: Gender): number {
  const bmi = weight / Math.pow(height / 100, 2);
  if (gender === 'male') {
    return Math.max(8, Math.min(45, 1.2 * bmi + 0.23 * age - 16.2));
  }
  return Math.max(12, Math.min(50, 1.2 * bmi + 0.23 * age - 5.4));
}

function estimateStartingWaist(weight: number, height: number, gender: Gender): number {
  const bmi = weight / Math.pow(height / 100, 2);
  if (gender === 'male') {
    return Math.round(bmi * 1.5 + 50);
  }
  return Math.round(bmi * 1.4 + 45);
}

export function generateWeightPredictions(profile: UserProfile): WeightPrediction[] {
  const predictions: WeightPrediction[] = [];
  let currentWeight = profile.startingWeight;
  const bmr = calculateBMR(currentWeight, profile.height, profile.age, profile.gender);
  const tdee = bmr * getActivityMultiplier(profile.exerciseLevel);
  const dietFactor = getDietFactor(profile.dietPreference);
  const avgIntake = tdee * 0.75;
  const startingBodyFat = estimateInitialBodyFatPercent(
    profile.startingWeight, profile.height, profile.age, profile.gender
  );
  const startingWaist = estimateStartingWaist(
    profile.startingWeight, profile.height, profile.gender
  );
  const startingFatKg = profile.startingWeight * startingBodyFat / 100;

  for (let day = 1; day <= 30; day++) {
    const weekNumber = Math.floor((day - 1) / 7);
    const adaptationFactor = Math.pow(0.98, weekNumber);
    const adjustedTDEE = tdee * adaptationFactor;
    const dailyDeficit = (adjustedTDEE - avgIntake) * dietFactor;

    // First 3 days include extra water weight loss
    const waterWeightLoss = day <= 3 ? 0.3 : 0;
    const fatLoss = dailyDeficit / 7700;

    currentWeight -= (fatLoss + waterWeightLoss);
    currentWeight = Math.max(currentWeight, profile.goalWeight - 2);

    // Estimate body fat
    const totalWeightLost = profile.startingWeight - currentWeight;
    const fatLostKg = totalWeightLost * 0.6;
    const currentFatKg = Math.max(startingFatKg - fatLostKg, 3);
    const currentBodyFat = Math.round((currentFatKg / currentWeight) * 100 * 10) / 10;

    // Estimate waist (roughly 0.8cm per kg lost)
    const waistReduction = totalWeightLost * 0.8;
    const currentWaist = Math.round((startingWaist - waistReduction) * 10) / 10;

    predictions.push({
      day,
      predictedWeight: Math.round(currentWeight * 10) / 10,
      predictedBodyFat: currentBodyFat,
      predictedWaist: currentWaist,
    });
  }

  return predictions;
}

export function getPredictionForDay(predictions: WeightPrediction[], day: number): WeightPrediction | undefined {
  return predictions.find(p => p.day === day);
}

export function getTotalPredictedLoss(predictions: WeightPrediction[], startingWeight: number): number {
  const day30 = predictions.find(p => p.day === 30);
  if (!day30) return 0;
  return Math.round((startingWeight - day30.predictedWeight) * 10) / 10;
}

export function getPredictedLossPercentage(startingWeight: number, predictions: WeightPrediction[]): number {
  const totalLoss = getTotalPredictedLoss(predictions, startingWeight);
  return Math.round((totalLoss / startingWeight) * 100 * 10) / 10;
}
