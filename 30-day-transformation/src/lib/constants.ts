import { Milestone } from '@/types';

// ============================================================================
// JOURNEY MILESTONES
// Key checkpoints throughout the 30-day transformation
// ============================================================================

export const MILESTONES: Milestone[] = [
  {
    day: 1,
    title: 'The Beginning',
    description:
      'Your journey starts today. Your body is adapting to the new fasting schedule. Hunger signals may be strong as ghrelin (hunger hormone) peaks at your usual meal times.',
    icon: '🚀',
    scienceNote:
      'Ghrelin, the hunger hormone, is secreted on a schedule based on habitual meal times. These signals will recalibrate within 3-4 days as your body adapts to intermittent fasting.',
    unlocked: false,
  },
  {
    day: 3,
    title: 'Adaptation Phase',
    description:
      'Ghrelin levels are adjusting to your new eating pattern. Initial water weight loss of 1-2 lbs is common as glycogen stores deplete (each gram of glycogen holds 3g of water).',
    icon: '💧',
    scienceNote:
      'The body stores approximately 400-500g of glycogen in the liver and muscles, bound to 1.2-1.5 kg of water. As glycogen is depleted during fasting, this water is released, accounting for early weight changes.',
    unlocked: false,
  },
  {
    day: 7,
    title: 'Energy Shift',
    description:
      'Your body is becoming fat-adapted. Mental clarity improves as the brain efficiently uses ketones. Most people report increased energy and reduced hunger at this stage.',
    icon: '⚡',
    scienceNote:
      'By day 7, hepatic fat oxidation increases significantly. The brain begins deriving 25-30% of its energy from ketone bodies (beta-hydroxybutyrate), which are a more efficient fuel than glucose.',
    unlocked: false,
  },
  {
    day: 14,
    title: 'Visible Changes',
    description:
      'Clothes are fitting differently. Average loss of 2-4 lbs of actual fat (not water). Waist circumference is decreasing as visceral fat is preferentially burned during fasting.',
    icon: '👔',
    scienceNote:
      'Research shows intermittent fasting preferentially targets visceral adipose tissue (VAT). A 2019 study in Cell Metabolism found that IF reduced visceral fat by 10-15% more than continuous caloric restriction.',
    unlocked: false,
  },
  {
    day: 21,
    title: 'Metabolic Shift',
    description:
      'The fasting habit is neurologically established. Autophagy cycles are well-practiced. Insulin sensitivity has markedly improved. Your metabolic health markers are transforming.',
    icon: '🧬',
    scienceNote:
      'Neuroplasticity research indicates that 21 days is sufficient for habit formation in the basal ganglia. Concurrently, studies show a 20-41% improvement in insulin sensitivity after 3 weeks of intermittent fasting.',
    unlocked: false,
  },
  {
    day: 30,
    title: 'Transformation Complete',
    description:
      'Average weight loss of 4-8 lbs of body fat. Metabolic markers significantly improved: lower fasting insulin, reduced CRP inflammation, improved lipid profile. Your body has been reset.',
    icon: '🏆',
    scienceNote:
      'A meta-analysis of IF studies shows average fat loss of 4-8 lbs over 4-8 weeks, with concurrent improvements in fasting insulin (-20-31%), CRP (-32%), LDL cholesterol (-7-11%), and triglycerides (-16-42%).',
    unlocked: false,
  },
];

// ============================================================================
// TRANSFORMATION STATISTICS
// Evidence-based expected outcomes from 30 days of intermittent fasting
// ============================================================================

export const TRANSFORMATION_STATS = {
  hghIncrease: {
    value: '+200-500%',
    label: 'HGH Increase',
    description: 'During fasting window',
  },
  visceralFat: {
    value: '-10%',
    label: 'Visceral Fat',
    description: 'Reduction in 30 days',
  },
  weightLoss: {
    value: '4-8 lbs',
    label: 'Avg Weight Loss',
    description: 'In 30 days of IF',
  },
  bodyFat: {
    value: '-1-3%',
    label: 'Body Fat Points',
    description: 'Reduction in 30 days',
  },
  insulinSensitivity: {
    value: '+41%',
    label: 'Insulin Sensitivity',
    description: 'Improvement',
  },
  inflammation: {
    value: '-32%',
    label: 'Inflammation',
    description: 'Marker reduction (CRP)',
  },
};

// ============================================================================
// FASTING SCHEDULE PRESETS
// Pre-configured fasting windows for common schedules
// ============================================================================

export const FASTING_PRESETS = [
  {
    label: 'Ramadan (Melbourne)',
    startTime: '05:16',
    endTime: '20:16',
    description: '~15 hours',
  },
  {
    label: 'Ramadan (Sydney)',
    startTime: '05:08',
    endTime: '20:05',
    description: '~15 hours',
  },
  {
    label: 'Ramadan (Brisbane)',
    startTime: '05:00',
    endTime: '19:45',
    description: '~14.75 hours',
  },
  {
    label: 'Ramadan (Perth)',
    startTime: '05:25',
    endTime: '20:30',
    description: '~15 hours',
  },
  {
    label: '16:8 IF',
    startTime: '20:00',
    endTime: '12:00',
    description: '16 hours fast',
  },
  {
    label: '18:6 IF',
    startTime: '20:00',
    endTime: '14:00',
    description: '18 hours fast',
  },
  {
    label: 'Custom',
    startTime: '',
    endTime: '',
    description: 'Set your own times',
  },
];

// ============================================================================
// DATES NUTRITIONAL DATA
// Medjool dates — the traditional food for breaking a fast
// ============================================================================

export const DATES_NUTRITION = {
  name: 'Medjool Dates',
  per100g: {
    calories: 277,
    carbs: 75,
    fiber: 8,
    sugar: 63,
    protein: 1.8,
    fat: 0.2,
    potassium: 656,
    magnesium: 43,
    iron: 1,
  },
  glycemicIndex: 45,
  benefits: [
    'Moderate GI (45) - gentle blood sugar rise',
    'High fiber (8g) - slows glucose absorption',
    'Rich in potassium (656mg) - restores electrolytes',
    'Natural sugars replenish glycogen gently',
    'Richest dried fruit source of polyphenols',
  ],
};

// ============================================================================
// APP CONSTANTS
// ============================================================================

/** Daily water intake goal in milliliters */
export const DAILY_WATER_GOAL = 2500;

/** Total number of days in the transformation journey */
export const TOTAL_JOURNEY_DAYS = 30;
