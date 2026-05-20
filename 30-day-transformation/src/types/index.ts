// === USER PROFILE ===
export type Gender = 'male' | 'female';
export type DietPreference = 'minimal-carbs' | 'balanced' | 'custom';
export type ExerciseLevel = 'none' | 'light' | 'moderate' | 'intense';
export type AppMode = 'health' | 'ramadan';

export interface UserProfile {
  id: string;
  name: string;
  startingWeight: number; // kg
  currentWeight: number; // kg
  goalWeight: number; // kg
  height: number; // cm
  age: number;
  gender: Gender;
  dietPreference: DietPreference;
  exerciseLevel: ExerciseLevel;
  startDate: string; // ISO date
  createdAt: string;
  updatedAt: string;
}

// === PHOTOS ===
export type PhotoAngle = 'front' | 'left' | 'right' | 'back';

export interface BodyPhoto {
  id: string;
  angle: PhotoAngle;
  dataUrl: string; // base64 JPEG
  takenAt: string;
  day: number; // 0 = before start
}

export interface GoalPhoto {
  id: string;
  dataUrl: string;
  uploadedAt: string;
}

// === FASTING ===
export interface FastingSchedule {
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  isCustom: boolean;
  timezone: string;
}

export interface FastingSession {
  id: string;
  date: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  completed: boolean;
  durationMinutes: number;
  targetMinutes: number;
}

// === METABOLIC STATE ===
export type MetabolicPhase =
  | 'fed'
  | 'early-fasting'
  | 'fat-burning'
  | 'deep-fasting';

export interface MetabolicState {
  phase: MetabolicPhase;
  hourIntoFast: number;
  insulinLevel: 'high' | 'declining' | 'low' | 'baseline';
  fatBurning: 'none' | 'starting' | 'active' | 'peak';
  autophagy: 'inactive' | 'initiating' | 'active';
  hghLevel: 'baseline' | 'rising' | 'elevated' | 'peak';
  description: string;
  benefits: string[];
}

export interface HourlyBenefit {
  hour: number;
  title: string;
  description: string;
  icon: string;
  phase: MetabolicPhase;
  color: string;
}

// === DAILY LOG ===
export interface MealEntry {
  id: string;
  type: 'iftar' | 'suhoor' | 'snack';
  description: string;
  phase?: 1 | 2 | 3;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  timestamp: string;
}

export interface ExerciseEntry {
  id: string;
  type: string;
  durationMinutes: number;
  intensity: 'light' | 'moderate' | 'intense';
  caloriesBurned?: number;
  wasFasted: boolean;
  timestamp: string;
}

export interface DailyLog {
  id: string;
  date: string;
  day: number; // 1-30
  weight?: number;
  bodyFat?: number;
  waistCm?: number;
  chestCm?: number;
  hipsCm?: number;
  armCm?: number;
  fastingSession?: FastingSession;
  meals: MealEntry[];
  exercises: ExerciseEntry[];
  waterIntakeMl: number;
  waterGoalMl: number;
  moodRating?: 1 | 2 | 3 | 4 | 5;
  energyRating?: 1 | 2 | 3 | 4 | 5;
  photos: BodyPhoto[];
  notes?: string;
  completed: boolean;
}

// === PREDICTIONS ===
export interface WeightPrediction {
  day: number;
  predictedWeight: number;
  actualWeight?: number;
  predictedBodyFat?: number;
  actualBodyFat?: number;
  predictedWaist?: number;
}

export interface TransformationPrediction {
  day: number;
  percentageLost: number;
  morphScale: number;
  waistReduction: number;
  faceSlim: number;
  overallScale: number;
}

// === MILESTONES ===
export interface Milestone {
  day: number;
  title: string;
  description: string;
  icon: string;
  scienceNote: string;
  unlocked: boolean;
}

// === MEAL PLANNING ===
export interface MealTemplate {
  id: string;
  name: string;
  type: 'iftar' | 'suhoor' | 'snack';
  phase?: 1 | 2 | 3;
  ingredients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTimeMinutes: number;
  dietTags: DietPreference[];
  imageEmoji: string;
}

export interface BreakingFastPhase {
  phase: 1 | 2 | 3;
  title: string;
  description: string;
  durationMinutes: { min: number; max: number };
  suggestedFoods: string[];
  nutritionTip: string;
}

// === STATISTICS ===
export interface TransformationStats {
  totalWeightLost: number;
  totalBodyFatLost: number;
  totalWaistReduction: number;
  fastingStreak: number;
  longestFast: number;
  totalFastingHours: number;
  avgDailyWater: number;
  exerciseCount: number;
  completedDays: number;
  adherenceRate: number;
}

// === APP SETTINGS ===
export interface AppSettings {
  mode: AppMode;
  theme: 'light' | 'dark' | 'system';
  onboardingComplete: boolean;
  notificationsEnabled: boolean;
  fastingReminders: boolean;
  weightUnit: 'kg' | 'lbs';
  heightUnit: 'cm' | 'ft';
  waterUnit: 'ml' | 'oz';
}

// === SHARING ===
export type ShareFormat = 'before-after' | 'montage' | 'tiktok-vertical';

export interface ShareCard {
  format: ShareFormat;
  dataUrl: string;
  createdAt: string;
}
