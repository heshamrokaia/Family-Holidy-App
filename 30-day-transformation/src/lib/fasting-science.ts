import { HourlyBenefit, MetabolicPhase } from '@/types';

// ============================================================================
// HOURLY FASTING BENEFITS
// Scientifically accurate timeline of what happens during a 15-16 hour fast
// ============================================================================

export const HOURLY_BENEFITS: HourlyBenefit[] = [
  // ── Hours 0-3: Fed Phase (Amber) ──────────────────────────────────────
  {
    hour: 0,
    title: 'Meal Consumed',
    description:
      'Digestion begins. Stomach breaks down food into chyme. Insulin spikes to shuttle glucose into cells for energy. Blood sugar rises as carbohydrates are absorbed.',
    icon: 'Utensils',
    phase: 'fed',
    color: 'text-amber-500',
  },
  {
    hour: 1,
    title: 'Peak Insulin Response',
    description:
      'Insulin reaches peak levels. Glucose floods into muscle and liver cells. The body is in full storage mode — excess energy is converted to glycogen and triglycerides.',
    icon: 'Activity',
    phase: 'fed',
    color: 'text-amber-500',
  },
  {
    hour: 2,
    title: 'Active Absorption',
    description:
      'Nutrients continue absorbing through the small intestine. Amino acids from protein enter the bloodstream. Dietary fats are packaged into chylomicrons for transport.',
    icon: 'Heart',
    phase: 'fed',
    color: 'text-amber-400',
  },
  {
    hour: 3,
    title: 'Digestion Winding Down',
    description:
      'Insulin begins to decline. Blood sugar stabilizes. Most nutrients have been absorbed. The body shifts from active digestion to utilizing stored energy.',
    icon: 'BatteryLow',
    phase: 'fed',
    color: 'text-amber-400',
  },

  // ── Hours 4-7: Early Fasting Phase (Blue) ─────────────────────────────
  {
    hour: 4,
    title: 'Post-Absorptive State',
    description:
      'Insulin drops to near-baseline. The body begins tapping liver glycogen for glucose. The metabolic switch from "fed" to "fasting" has started. Ghrelin (hunger hormone) may rise.',
    icon: 'Activity',
    phase: 'early-fasting',
    color: 'text-blue-500',
  },
  {
    hour: 5,
    title: 'Glycogen Depletion Begins',
    description:
      'Liver glycogen stores are being steadily drawn down. Glucagon rises as insulin falls. The liver starts releasing stored glucose to maintain blood sugar levels.',
    icon: 'Zap',
    phase: 'early-fasting',
    color: 'text-blue-500',
  },
  {
    hour: 6,
    title: 'Fat Mobilization Starts',
    description:
      'With declining insulin, adipose tissue begins releasing free fatty acids. Lipolysis (fat breakdown) accelerates. The body is preparing to shift its primary fuel source.',
    icon: 'Flame',
    phase: 'early-fasting',
    color: 'text-blue-400',
  },
  {
    hour: 7,
    title: 'Metabolic Transition',
    description:
      'Glycogen reserves are significantly reduced. Fatty acid oxidation increases in muscle tissue. Growth hormone begins a gradual rise to preserve lean mass during the fast.',
    icon: 'Activity',
    phase: 'early-fasting',
    color: 'text-blue-400',
  },

  // ── Hours 8-11: Fat Burning Phase (Orange) ────────────────────────────
  {
    hour: 8,
    title: 'Fat Burning Activated',
    description:
      'The body has shifted to primarily burning fat for fuel. Fatty acid oxidation is now significant. Liver begins converting fatty acids into ketone bodies — an efficient alternative fuel.',
    icon: 'Flame',
    phase: 'fat-burning',
    color: 'text-orange-500',
  },
  {
    hour: 9,
    title: 'Ketone Production Rising',
    description:
      'Beta-hydroxybutyrate (BHB) levels climb in the blood. Ketones provide clean energy to the brain and muscles. Mental clarity often improves as the brain adapts to ketone fuel.',
    icon: 'Brain',
    phase: 'fat-burning',
    color: 'text-orange-500',
  },
  {
    hour: 10,
    title: 'Growth Hormone Surge',
    description:
      'Human Growth Hormone (HGH) levels increase substantially — up to 100-200% above baseline. HGH preserves muscle mass, accelerates fat metabolism, and supports cellular repair.',
    icon: 'Rocket',
    phase: 'fat-burning',
    color: 'text-orange-400',
  },
  {
    hour: 11,
    title: 'Inflammation Reduction',
    description:
      'Pro-inflammatory markers like IL-6 and TNF-alpha begin to decrease. Oxidative stress drops as the body upregulates antioxidant defense pathways. Cellular stress resistance improves.',
    icon: 'Shield',
    phase: 'fat-burning',
    color: 'text-orange-400',
  },

  // ── Hours 12-15: Deep Fasting Phase (Purple) ──────────────────────────
  {
    hour: 12,
    title: 'Autophagy Initiates',
    description:
      'Cellular autophagy — the body\'s recycling system — activates. Damaged proteins and dysfunctional organelles are tagged for breakdown. Cells begin deep self-cleaning and renewal.',
    icon: 'Recycle',
    phase: 'deep-fasting',
    color: 'text-purple-500',
  },
  {
    hour: 13,
    title: 'Peak Fat Oxidation',
    description:
      'Fat burning reaches its highest rate. Visceral fat (dangerous belly fat) is preferentially metabolized. Insulin sensitivity improves dramatically as receptor sites reset.',
    icon: 'Sparkles',
    phase: 'deep-fasting',
    color: 'text-purple-500',
  },
  {
    hour: 14,
    title: 'HGH at Peak Levels',
    description:
      'Growth Hormone surges to 200-500% above baseline. This powerful anabolic state accelerates fat loss while preserving lean muscle. Cellular repair processes are at their most active.',
    icon: 'Crown',
    phase: 'deep-fasting',
    color: 'text-purple-400',
  },
  {
    hour: 15,
    title: 'Maximum Benefits Achieved',
    description:
      'All fasting benefits converge: autophagy is active, HGH is elevated, fat oxidation is at peak, inflammation markers are at their lowest. Your body has completed a full metabolic reset.',
    icon: 'Sparkles',
    phase: 'deep-fasting',
    color: 'text-purple-400',
  },
];

// ============================================================================
// METABOLIC PHASE HELPERS
// ============================================================================

/**
 * Determines the current metabolic phase based on hours into the fast.
 */
export function getMetabolicPhase(hourIntoFast: number): MetabolicPhase {
  if (hourIntoFast < 4) return 'fed';
  if (hourIntoFast < 8) return 'early-fasting';
  if (hourIntoFast < 12) return 'fat-burning';
  return 'deep-fasting';
}

/**
 * Returns a human-readable description of the metabolic phase.
 */
export function getMetabolicDescription(phase: MetabolicPhase): string {
  switch (phase) {
    case 'fed':
      return 'Your body is actively digesting and absorbing nutrients. Insulin is elevated, and energy is being stored as glycogen and fat. This is the absorption phase.';
    case 'early-fasting':
      return 'Insulin is dropping and your body is transitioning to stored energy. Liver glycogen is being depleted and fat mobilization is beginning. Hunger hormones may peak during this phase.';
    case 'fat-burning':
      return 'Your body has switched to burning fat as its primary fuel. Ketone production is rising, growth hormone is increasing, and mental clarity often improves. Inflammation markers begin to drop.';
    case 'deep-fasting':
      return 'Maximum fasting benefits are active. Autophagy (cellular cleanup) is engaged, HGH has surged 200-500%, visceral fat is being preferentially burned, and insulin sensitivity is resetting.';
  }
}

/**
 * Returns a Tailwind background color class for the metabolic phase.
 */
export function getPhaseColor(phase: MetabolicPhase): string {
  switch (phase) {
    case 'fed':
      return 'bg-amber-500';
    case 'early-fasting':
      return 'bg-blue-500';
    case 'fat-burning':
      return 'bg-orange-500';
    case 'deep-fasting':
      return 'bg-purple-500';
  }
}

/**
 * Returns a short human-readable label for the metabolic phase.
 */
export function getPhaseLabel(phase: MetabolicPhase): string {
  switch (phase) {
    case 'fed':
      return 'Fed State';
    case 'early-fasting':
      return 'Early Fasting';
    case 'fat-burning':
      return 'Fat Burning';
    case 'deep-fasting':
      return 'Deep Fasting';
  }
}
