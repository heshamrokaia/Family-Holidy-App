import { BreakingFastPhase, MealTemplate, DietPreference } from '@/types';

// ============================================================================
// BREAKING FAST PHASES
// The scientifically optimal 3-phase approach to breaking a long fast
// ============================================================================

export const BREAKING_FAST_PHASES: BreakingFastPhase[] = [
  {
    phase: 1,
    title: 'Hydrate & Gentle Sugars',
    description:
      'Start with water and 2-3 dates. The natural sugars in dates provide a gentle glucose rise with a moderate glycemic index (45), while the fiber slows absorption. Water rehydrates cells after the long fast.',
    durationMinutes: { min: 5, max: 10 },
    suggestedFoods: [
      'Water (room temperature)',
      'Medjool dates (2-3)',
      'Coconut water',
      'Warm lemon water',
    ],
    nutritionTip:
      'Avoid cold water on an empty stomach — room temperature is gentler on digestion. Dates provide potassium (656mg/100g) which helps restore electrolyte balance.',
  },
  {
    phase: 2,
    title: 'Light Soup or Broth',
    description:
      'A warm broth or light soup wakes up the digestive system gradually. The warmth stimulates gastric motility and the liquid format is easy to process. Bone broth adds collagen and minerals.',
    durationMinutes: { min: 10, max: 20 },
    suggestedFoods: [
      'Bone broth',
      'Lentil soup',
      'Chicken broth with vegetables',
      'Miso soup',
      'Tomato soup',
      'Pumpkin soup',
    ],
    nutritionTip:
      'Warm liquids stimulate the vagus nerve and promote digestive enzyme secretion. This "priming" phase prevents the bloating and discomfort that comes from eating a heavy meal immediately after fasting.',
  },
  {
    phase: 3,
    title: 'Balanced Main Meal',
    description:
      'Now your digestive system is primed. Eat a balanced meal with lean protein, complex carbohydrates, healthy fats, and vegetables. Eat slowly and stop when 80% full.',
    durationMinutes: { min: 20, max: 30 },
    suggestedFoods: [
      'Grilled chicken or fish',
      'Brown rice or quinoa',
      'Roasted vegetables',
      'Mixed salad with olive oil',
      'Lean lamb or beef',
      'Sweet potato',
    ],
    nutritionTip:
      'Protein should be the centerpiece — aim for 30-40g. Protein stimulates muscle protein synthesis, which is amplified by the elevated HGH from your fast. Include fiber-rich vegetables to support gut health.',
  },
];

// ============================================================================
// SUHOOR (PRE-DAWN) MEAL TEMPLATES
// Slow-digesting, high-protein meals designed to sustain energy during the fast
// ============================================================================

export const SUHOOR_MEALS: MealTemplate[] = [
  {
    id: 'suhoor-overnight-oats',
    name: 'Overnight Oats with Nut Butter',
    type: 'suhoor',
    ingredients: [
      'Rolled oats (60g)',
      'Greek yogurt (100g)',
      'Almond butter (1 tbsp)',
      'Chia seeds (1 tbsp)',
      'Banana (half)',
      'Honey (1 tsp)',
      'Milk (100ml)',
    ],
    calories: 480,
    protein: 22,
    carbs: 58,
    fat: 18,
    prepTimeMinutes: 5,
    dietTags: ['balanced'],
    imageEmoji: '🥣',
  },
  {
    id: 'suhoor-eggs-avocado',
    name: 'Scrambled Eggs & Avocado Toast',
    type: 'suhoor',
    ingredients: [
      'Eggs (3 large)',
      'Whole grain bread (2 slices)',
      'Avocado (half)',
      'Cherry tomatoes (50g)',
      'Feta cheese (20g)',
      'Olive oil (1 tsp)',
    ],
    calories: 520,
    protein: 28,
    carbs: 35,
    fat: 30,
    prepTimeMinutes: 10,
    dietTags: ['balanced', 'minimal-carbs'],
    imageEmoji: '🍳',
  },
  {
    id: 'suhoor-yogurt-bowl',
    name: 'Greek Yogurt Power Bowl',
    type: 'suhoor',
    ingredients: [
      'Greek yogurt (200g)',
      'Mixed berries (80g)',
      'Granola (40g)',
      'Walnuts (15g)',
      'Flaxseeds (1 tbsp)',
      'Honey (1 tbsp)',
    ],
    calories: 440,
    protein: 26,
    carbs: 48,
    fat: 16,
    prepTimeMinutes: 5,
    dietTags: ['balanced'],
    imageEmoji: '🫐',
  },
  {
    id: 'suhoor-protein-smoothie',
    name: 'Protein Smoothie with Oats',
    type: 'suhoor',
    ingredients: [
      'Protein powder (1 scoop, 30g)',
      'Rolled oats (40g)',
      'Banana (1 medium)',
      'Peanut butter (1 tbsp)',
      'Milk (250ml)',
      'Ice cubes',
    ],
    calories: 490,
    protein: 35,
    carbs: 52,
    fat: 14,
    prepTimeMinutes: 5,
    dietTags: ['balanced'],
    imageEmoji: '🥤',
  },
  {
    id: 'suhoor-shakshuka-light',
    name: 'Light Shakshuka with Bread',
    type: 'suhoor',
    ingredients: [
      'Eggs (2 large)',
      'Canned tomatoes (150g)',
      'Bell pepper (half)',
      'Onion (quarter)',
      'Feta cheese (30g)',
      'Whole grain pita (1)',
      'Olive oil (1 tbsp)',
      'Cumin & paprika',
    ],
    calories: 460,
    protein: 24,
    carbs: 38,
    fat: 22,
    prepTimeMinutes: 15,
    dietTags: ['balanced'],
    imageEmoji: '🍲',
  },
  {
    id: 'suhoor-minimal-carb',
    name: 'Egg & Cheese Lettuce Wraps',
    type: 'suhoor',
    ingredients: [
      'Eggs (3 large)',
      'Cheddar cheese (40g)',
      'Butter lettuce leaves (4)',
      'Avocado (half)',
      'Turkey slices (60g)',
      'Hot sauce (optional)',
    ],
    calories: 480,
    protein: 36,
    carbs: 8,
    fat: 34,
    prepTimeMinutes: 10,
    dietTags: ['minimal-carbs'],
    imageEmoji: '🥬',
  },
];

// ============================================================================
// IFTAR (MAIN MEAL) TEMPLATES
// Organized by the 3-phase breaking fast protocol
// ============================================================================

export const IFTAR_MEALS: MealTemplate[] = [
  // ── Phase 1: Dates & Hydration ────────────────────────────────────────
  {
    id: 'iftar-dates-water',
    name: 'Classic Dates & Water',
    type: 'iftar',
    phase: 1,
    ingredients: [
      'Medjool dates (3)',
      'Water (500ml, room temperature)',
    ],
    calories: 200,
    protein: 1,
    carbs: 54,
    fat: 0,
    prepTimeMinutes: 0,
    dietTags: ['balanced', 'minimal-carbs', 'custom'],
    imageEmoji: '🌴',
  },
  {
    id: 'iftar-dates-milk',
    name: 'Dates with Warm Milk',
    type: 'iftar',
    phase: 1,
    ingredients: [
      'Medjool dates (2)',
      'Warm milk (200ml)',
      'Pinch of saffron (optional)',
    ],
    calories: 260,
    protein: 8,
    carbs: 46,
    fat: 5,
    prepTimeMinutes: 3,
    dietTags: ['balanced', 'custom'],
    imageEmoji: '🥛',
  },

  // ── Phase 2: Soups & Broths ───────────────────────────────────────────
  {
    id: 'iftar-lentil-soup',
    name: 'Red Lentil Soup',
    type: 'iftar',
    phase: 2,
    ingredients: [
      'Red lentils (80g dry)',
      'Onion (1 medium)',
      'Carrot (1 medium)',
      'Garlic (2 cloves)',
      'Cumin & turmeric',
      'Lemon juice (1 tbsp)',
      'Olive oil (1 tbsp)',
    ],
    calories: 280,
    protein: 16,
    carbs: 40,
    fat: 6,
    prepTimeMinutes: 25,
    dietTags: ['balanced', 'custom'],
    imageEmoji: '🍜',
  },
  {
    id: 'iftar-bone-broth',
    name: 'Chicken Bone Broth',
    type: 'iftar',
    phase: 2,
    ingredients: [
      'Chicken bone broth (350ml)',
      'Fresh ginger (1 tsp grated)',
      'Turmeric (pinch)',
      'Parsley (garnish)',
      'Sea salt & black pepper',
    ],
    calories: 80,
    protein: 10,
    carbs: 2,
    fat: 3,
    prepTimeMinutes: 5,
    dietTags: ['balanced', 'minimal-carbs', 'custom'],
    imageEmoji: '🥣',
  },
  {
    id: 'iftar-pumpkin-soup',
    name: 'Roasted Pumpkin Soup',
    type: 'iftar',
    phase: 2,
    ingredients: [
      'Pumpkin (300g)',
      'Onion (1 medium)',
      'Garlic (2 cloves)',
      'Coconut milk (100ml)',
      'Vegetable stock (200ml)',
      'Nutmeg & cinnamon',
      'Olive oil (1 tbsp)',
    ],
    calories: 220,
    protein: 5,
    carbs: 28,
    fat: 10,
    prepTimeMinutes: 30,
    dietTags: ['balanced', 'custom'],
    imageEmoji: '🎃',
  },

  // ── Phase 3: Main Dishes ──────────────────────────────────────────────
  {
    id: 'iftar-grilled-chicken',
    name: 'Grilled Chicken with Quinoa',
    type: 'iftar',
    phase: 3,
    ingredients: [
      'Chicken breast (180g)',
      'Quinoa (80g dry)',
      'Mixed salad greens (100g)',
      'Cherry tomatoes (80g)',
      'Cucumber (half)',
      'Olive oil & lemon dressing',
      'Herbs (parsley, mint)',
    ],
    calories: 520,
    protein: 45,
    carbs: 42,
    fat: 16,
    prepTimeMinutes: 25,
    dietTags: ['balanced'],
    imageEmoji: '🍗',
  },
  {
    id: 'iftar-salmon-vegetables',
    name: 'Baked Salmon with Roasted Vegetables',
    type: 'iftar',
    phase: 3,
    ingredients: [
      'Salmon fillet (180g)',
      'Sweet potato (150g)',
      'Broccoli (100g)',
      'Asparagus (80g)',
      'Olive oil (1 tbsp)',
      'Lemon, garlic, dill',
    ],
    calories: 540,
    protein: 40,
    carbs: 35,
    fat: 24,
    prepTimeMinutes: 30,
    dietTags: ['balanced'],
    imageEmoji: '🐟',
  },
  {
    id: 'iftar-lamb-rice',
    name: 'Spiced Lamb with Saffron Rice',
    type: 'iftar',
    phase: 3,
    ingredients: [
      'Lean lamb leg (150g)',
      'Basmati rice (80g dry)',
      'Saffron & cardamom',
      'Mixed nuts (almonds, pine nuts — 20g)',
      'Onion (1 medium)',
      'Greek salad (side)',
      'Olive oil (1 tbsp)',
    ],
    calories: 620,
    protein: 38,
    carbs: 55,
    fat: 26,
    prepTimeMinutes: 40,
    dietTags: ['balanced'],
    imageEmoji: '🍖',
  },
  {
    id: 'iftar-chicken-stir-fry',
    name: 'Chicken & Vegetable Stir-Fry',
    type: 'iftar',
    phase: 3,
    ingredients: [
      'Chicken thigh (160g)',
      'Brown rice (70g dry)',
      'Broccoli (80g)',
      'Bell peppers (1 medium)',
      'Snap peas (60g)',
      'Soy sauce (1 tbsp)',
      'Sesame oil (1 tsp)',
      'Ginger & garlic',
    ],
    calories: 500,
    protein: 38,
    carbs: 48,
    fat: 16,
    prepTimeMinutes: 20,
    dietTags: ['balanced'],
    imageEmoji: '🥘',
  },
  {
    id: 'iftar-grilled-steak-lowcarb',
    name: 'Grilled Steak with Garden Salad',
    type: 'iftar',
    phase: 3,
    ingredients: [
      'Beef sirloin steak (200g)',
      'Mixed salad greens (150g)',
      'Avocado (half)',
      'Cherry tomatoes (80g)',
      'Red onion (quarter)',
      'Olive oil & balsamic dressing',
      'Grilled zucchini (100g)',
    ],
    calories: 560,
    protein: 48,
    carbs: 14,
    fat: 34,
    prepTimeMinutes: 20,
    dietTags: ['balanced', 'minimal-carbs'],
    imageEmoji: '🥩',
  },
  {
    id: 'iftar-fish-tacos',
    name: 'Grilled Fish Tacos',
    type: 'iftar',
    phase: 3,
    ingredients: [
      'White fish fillet (barramundi/snapper — 180g)',
      'Corn tortillas (2 small)',
      'Cabbage slaw (80g)',
      'Avocado crema (30g)',
      'Lime juice',
      'Fresh coriander',
      'Chilli flakes',
    ],
    calories: 440,
    protein: 36,
    carbs: 32,
    fat: 18,
    prepTimeMinutes: 20,
    dietTags: ['balanced'],
    imageEmoji: '🌮',
  },
  {
    id: 'iftar-kofta-salad',
    name: 'Lamb Kofta with Fattoush Salad',
    type: 'iftar',
    phase: 3,
    ingredients: [
      'Lean lamb mince (150g)',
      'Onion & parsley (mixed in)',
      'Cumin, coriander, paprika',
      'Mixed lettuce (100g)',
      'Tomato, cucumber, radish',
      'Pita chips (1 small pita)',
      'Sumac & lemon dressing',
    ],
    calories: 490,
    protein: 35,
    carbs: 28,
    fat: 26,
    prepTimeMinutes: 25,
    dietTags: ['balanced'],
    imageEmoji: '🧆',
  },
];

// ============================================================================
// MEAL FILTERING
// ============================================================================

/**
 * Filters suhoor and iftar meals by the user's diet preference.
 * 'custom' preference returns all meals (no filtering).
 */
export function getMealsByDiet(diet: DietPreference): {
  suhoor: MealTemplate[];
  iftar: MealTemplate[];
} {
  if (diet === 'custom') {
    return {
      suhoor: SUHOOR_MEALS,
      iftar: IFTAR_MEALS,
    };
  }

  return {
    suhoor: SUHOOR_MEALS.filter((meal) => meal.dietTags.includes(diet)),
    iftar: IFTAR_MEALS.filter((meal) => meal.dietTags.includes(diet)),
  };
}
