import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserProfile,
  BodyPhoto,
  GoalPhoto,
  FastingSchedule,
  FastingSession,
  DailyLog,
  MealEntry,
  ExerciseEntry,
  WeightPrediction,
  AppSettings,
  AppMode,
} from '@/types';
import { generateId, todayISO, getCurrentDay, getTimezone } from '@/lib/utils';

// === Default values ===

const defaultProfile: UserProfile = {
  id: '',
  name: '',
  startingWeight: 80,
  currentWeight: 80,
  goalWeight: 75,
  height: 175,
  age: 30,
  gender: 'male',
  dietPreference: 'balanced',
  exerciseLevel: 'light',
  startDate: todayISO(),
  createdAt: todayISO(),
  updatedAt: todayISO(),
};

const defaultSchedule: FastingSchedule = {
  startTime: '05:16',
  endTime: '20:16',
  isCustom: false,
  timezone: getTimezone(),
};

const defaultSettings: AppSettings = {
  mode: 'health',
  theme: 'light',
  onboardingComplete: false,
  notificationsEnabled: false,
  fastingReminders: false,
  weightUnit: 'kg',
  heightUnit: 'cm',
  waterUnit: 'ml',
};

// === State interface ===

interface TransformationState {
  // Data
  userProfile: UserProfile;
  bodyPhotos: BodyPhoto[];
  goalPhoto: GoalPhoto | null;
  fastingSchedule: FastingSchedule;
  dailyLogs: DailyLog[];
  weightPredictions: WeightPrediction[];
  settings: AppSettings;
  hydrated: boolean;

  // Profile actions
  setUserProfile: (updates: Partial<UserProfile>) => void;

  // Photo actions
  addBodyPhoto: (photo: Omit<BodyPhoto, 'id'>) => void;
  removeBodyPhoto: (id: string) => void;
  setGoalPhoto: (photo: Omit<GoalPhoto, 'id'> | null) => void;

  // Fasting actions
  setFastingSchedule: (schedule: Partial<FastingSchedule>) => void;
  startFastingSession: (date: string) => void;
  endFastingSession: (date: string, completed: boolean) => void;

  // Daily log actions
  getOrCreateDailyLog: (date: string) => DailyLog;
  updateDailyLog: (date: string, updates: Partial<DailyLog>) => void;
  addMeal: (date: string, meal: Omit<MealEntry, 'id'>) => void;
  removeMeal: (date: string, mealId: string) => void;
  addExercise: (date: string, exercise: Omit<ExerciseEntry, 'id'>) => void;
  removeExercise: (date: string, exerciseId: string) => void;
  updateWaterIntake: (date: string, ml: number) => void;

  // Prediction actions
  generatePredictions: () => void;

  // Settings actions
  completeOnboarding: () => void;
  setMode: (mode: AppMode) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Reset
  resetJourney: () => void;

  // Hydration
  setHydrated: () => void;
}

// === Activity multipliers ===

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  none: 1.2,
  light: 1.375,
  moderate: 1.55,
  intense: 1.725,
};

// === Diet factors ===

const DIET_FACTORS: Record<string, number> = {
  'minimal-carbs': 1.15,
  balanced: 1.0,
  custom: 1.0,
};

// === Helper: create an empty daily log ===

function createEmptyDailyLog(date: string, day: number): DailyLog {
  return {
    id: generateId(),
    date,
    day,
    meals: [],
    exercises: [],
    waterIntakeMl: 0,
    waterGoalMl: 2500,
    photos: [],
    completed: false,
  };
}

// === Store ===

export const useTransformationStore = create<TransformationState>()(
  persist(
    (set, get) => ({
      // --- Initial state ---
      userProfile: { ...defaultProfile },
      bodyPhotos: [],
      goalPhoto: null,
      fastingSchedule: { ...defaultSchedule },
      dailyLogs: [],
      weightPredictions: [],
      settings: { ...defaultSettings },
      hydrated: false,

      // --- Profile actions ---

      setUserProfile: (updates) =>
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            ...updates,
            updatedAt: todayISO(),
          },
        })),

      // --- Photo actions ---

      addBodyPhoto: (photo) =>
        set((state) => ({
          bodyPhotos: [
            ...state.bodyPhotos,
            { ...photo, id: generateId() },
          ],
        })),

      removeBodyPhoto: (id) =>
        set((state) => ({
          bodyPhotos: state.bodyPhotos.filter((p) => p.id !== id),
        })),

      setGoalPhoto: (photo) =>
        set({
          goalPhoto: photo ? { ...photo, id: generateId() } : null,
        }),

      // --- Fasting actions ---

      setFastingSchedule: (schedule) =>
        set((state) => ({
          fastingSchedule: {
            ...state.fastingSchedule,
            ...schedule,
          },
        })),

      startFastingSession: (date) => {
        const state = get();
        state.getOrCreateDailyLog(date);
        const { startTime, endTime } = state.fastingSchedule;

        // Calculate target duration in minutes
        const [startH, startM] = startTime.split(':').map(Number);
        const [endH, endM] = endTime.split(':').map(Number);
        let targetMinutes = (endH * 60 + endM) - (startH * 60 + startM);
        if (targetMinutes < 0) targetMinutes += 24 * 60;

        const session: FastingSession = {
          id: generateId(),
          date,
          scheduledStart: startTime,
          scheduledEnd: endTime,
          actualStart: new Date().toISOString(),
          completed: false,
          durationMinutes: 0,
          targetMinutes,
        };

        set((s) => ({
          dailyLogs: s.dailyLogs.map((l) =>
            l.date === date ? { ...l, fastingSession: session } : l
          ),
        }));
      },

      endFastingSession: (date, completed) => {
        set((state) => ({
          dailyLogs: state.dailyLogs.map((log) => {
            if (log.date !== date || !log.fastingSession) return log;

            const now = new Date();
            const actualStart = log.fastingSession.actualStart
              ? new Date(log.fastingSession.actualStart)
              : now;
            const durationMinutes = Math.round(
              (now.getTime() - actualStart.getTime()) / 60000
            );

            return {
              ...log,
              fastingSession: {
                ...log.fastingSession,
                actualEnd: now.toISOString(),
                completed,
                durationMinutes,
              },
            };
          }),
        }));
      },

      // --- Daily log actions ---

      getOrCreateDailyLog: (date) => {
        const state = get();
        const existing = state.dailyLogs.find((l) => l.date === date);
        if (existing) return existing;

        const day = getCurrentDay(state.userProfile.startDate);
        const newLog = createEmptyDailyLog(date, day);

        set((s) => ({
          dailyLogs: [...s.dailyLogs, newLog],
        }));

        return newLog;
      },

      updateDailyLog: (date, updates) => {
        // Ensure the log exists first
        get().getOrCreateDailyLog(date);

        set((state) => ({
          dailyLogs: state.dailyLogs.map((log) =>
            log.date === date ? { ...log, ...updates } : log
          ),
        }));
      },

      addMeal: (date, meal) => {
        get().getOrCreateDailyLog(date);

        const newMeal: MealEntry = { ...meal, id: generateId() };

        set((state) => ({
          dailyLogs: state.dailyLogs.map((log) =>
            log.date === date
              ? { ...log, meals: [...log.meals, newMeal] }
              : log
          ),
        }));
      },

      removeMeal: (date, mealId) =>
        set((state) => ({
          dailyLogs: state.dailyLogs.map((log) =>
            log.date === date
              ? { ...log, meals: log.meals.filter((m) => m.id !== mealId) }
              : log
          ),
        })),

      addExercise: (date, exercise) => {
        get().getOrCreateDailyLog(date);

        const newExercise: ExerciseEntry = { ...exercise, id: generateId() };

        set((state) => ({
          dailyLogs: state.dailyLogs.map((log) =>
            log.date === date
              ? { ...log, exercises: [...log.exercises, newExercise] }
              : log
          ),
        }));
      },

      removeExercise: (date, exerciseId) =>
        set((state) => ({
          dailyLogs: state.dailyLogs.map((log) =>
            log.date === date
              ? {
                  ...log,
                  exercises: log.exercises.filter((e) => e.id !== exerciseId),
                }
              : log
          ),
        })),

      updateWaterIntake: (date, ml) => {
        get().getOrCreateDailyLog(date);

        set((state) => ({
          dailyLogs: state.dailyLogs.map((log) =>
            log.date === date ? { ...log, waterIntakeMl: ml } : log
          ),
        }));
      },

      // --- Prediction actions ---

      generatePredictions: () => {
        const { userProfile } = get();
        const {
          startingWeight,
          height,
          age,
          gender,
          exerciseLevel,
          dietPreference,
        } = userProfile;

        // Mifflin-St Jeor BMR
        const bmr =
          gender === 'male'
            ? 10 * startingWeight + 6.25 * height - 5 * age + 5
            : 10 * startingWeight + 6.25 * height - 5 * age - 161;

        const activityMultiplier = ACTIVITY_MULTIPLIERS[exerciseLevel] ?? 1.375;
        const tdee = bmr * activityMultiplier;
        const avgIntake = tdee * 0.75;
        const dietFactor = DIET_FACTORS[dietPreference] ?? 1.0;

        const predictions: WeightPrediction[] = [];
        let currentWeight = startingWeight;

        for (let day = 0; day <= 30; day++) {
          const weekNumber = Math.floor(day / 7);
          const adaptationFactor = Math.pow(0.98, weekNumber);

          const dailyDeficit =
            (tdee * adaptationFactor - avgIntake) * dietFactor;
          const fatWeightLoss = dailyDeficit / 7700;

          // First 3 days: extra water weight loss
          const waterLoss = day > 0 && day <= 3 ? 0.3 : 0;

          if (day > 0) {
            currentWeight -= fatWeightLoss + waterLoss;
          }

          predictions.push({
            day,
            predictedWeight: Math.round(currentWeight * 100) / 100,
          });
        }

        set({ weightPredictions: predictions });
      },

      // --- Settings actions ---

      completeOnboarding: () =>
        set((state) => ({
          settings: { ...state.settings, onboardingComplete: true },
        })),

      setMode: (mode) =>
        set((state) => ({
          settings: { ...state.settings, mode },
        })),

      setTheme: (theme) =>
        set((state) => ({
          settings: { ...state.settings, theme },
        })),

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      // --- Reset ---

      resetJourney: () =>
        set((state) => ({
          userProfile: { ...defaultProfile },
          bodyPhotos: [],
          goalPhoto: null,
          fastingSchedule: { ...defaultSchedule },
          dailyLogs: [],
          weightPredictions: [],
          // Preserve settings
          settings: state.settings,
        })),

      // --- Hydration ---

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: '30-day-transformation',
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
