/**
 * Restora — answer scoring utility.
 *
 * Takes the raw `answers` object from SurveySection state
 * and returns per-dimension scores normalised to 0–100,
 * plus an overall fatigue score.
 *
 * Usage:
 *   import { scoreAnswers } from './scoreAnswers';
 *   const scores = scoreAnswers(answers); // pass to ResultTeaser
 *
 * Input shape:
 *   { q1: 'often', q2: 'always', q3: 'sometimes', ... }
 *
 * Output shape:
 *   {
 *     dimensions: {
 *       attention_fragmentation: 75,   // 0–100
 *       working_memory: 50,
 *       decision_fatigue: 62,
 *       dopamine_dependency: 88,
 *       recovery_quality: 33,
 *     },
 *     overall: 62,                     // weighted average, 0–100
 *     dominantDimension: 'dopamine_dependency',
 *     severity: 'moderate',            // 'low' | 'moderate' | 'high'
 *   }
 */

const SCORE_MAP = {
  never: 0,
  rarely: 1,
  sometimes: 2,
  often: 3,
  always: 4,
};

// Which question IDs belong to each dimension
const DIMENSION_QUESTIONS = {
  attention_fragmentation: ["q1", "q2", "q3"],
  working_memory: ["q4", "q5"],
  decision_fatigue: ["q6", "q7"],
  dopamine_dependency: ["q8", "q9"],
  recovery_quality: ["q10", "q11", "q12"],
};

// Max possible raw score per dimension (questions × 4)
const DIMENSION_MAX = {
  attention_fragmentation: 12,
  working_memory: 8,
  decision_fatigue: 8,
  dopamine_dependency: 8,
  recovery_quality: 12,
};

// Human-readable labels for each dimension (used in ResultTeaser UI)
export const DIMENSION_LABELS = {
  attention_fragmentation: "Attention Fragmentation",
  working_memory: "Working Memory",
  decision_fatigue: "Decision Fatigue",
  dopamine_dependency: "Dopamine Dependency",
  recovery_quality: "Recovery Quality",
};

// Short recovery message per dimension shown after submission
export const DIMENSION_INSIGHTS = {
  attention_fragmentation:
    "Your focus is fragmenting fast. Short, distraction-free work blocks will help rebuild your attention muscle.",
  working_memory:
    "Your working memory is under strain. Externalising tasks and reducing open loops will give your brain breathing room.",
  decision_fatigue:
    "You're burning through willpower on micro-decisions. Routines and defaults free up mental energy for what matters.",
  dopamine_dependency:
    "Your brain has recalibrated to expect constant novelty. A gradual stimulation detox will restore your baseline.",
  recovery_quality:
    "Your rest isn't actually restful. True cognitive recovery means unstimulated downtime, not just switching screens.",
};

// Human-readable one-liner for each dimension score (keyed by severity band)
export const DIMENSION_TRANSLATIONS = {
  attention_fragmentation: {
    low: "Your focus holds reasonably well through the day.",
    moderate: "You're losing focus before you even notice it's gone.",
    high: "Your attention is scattering the moment something moves on screen.",
  },
  working_memory: {
    low: "You're holding onto tasks and context without much trouble.",
    moderate: "You're losing the thread before you finish the thought.",
    high: "You're re-reading the same paragraph three times and nothing sticks.",
  },
  decision_fatigue: {
    low: "Everyday choices aren't draining you much.",
    moderate: "Small decisions are eating into your energy before lunch.",
    high: "You're paralysed by what to eat for dinner because your brain is spent.",
  },
  dopamine_dependency: {
    low: "You can sit with boredom without reaching for your phone.",
    moderate: "You're reaching for a scroll hit every time focus dips.",
    high: "Nothing feels interesting unless it's instant and novel.",
  },
  recovery_quality: {
    low: "Your downtime actually recharges you.",
    moderate: "Your breaks refuel the body but leave the mind buzzing.",
    high: "You're waking up tired because rest never reaches your brain.",
  },
};

// Headline sentence per severity level that interprets the overall score
export const SEVERITY_HEADLINES = {
  low: "Your cognitive stamina is in decent shape, but there's room to sharpen it.",
  moderate: "Your brain is running at below half capacity by midday.",
  high: "Your mind is hitting a wall well before your day is over.",
};

// What Restora will do for the dominant dimension
export const DOMINANT_RECOVERY_PROMISE = {
  attention_fragmentation:
    "Restoring your attention span will have the fastest impact on how present you feel.",
  working_memory:
    "Restoring your working memory will have the fastest impact on how sharp you feel.",
  decision_fatigue:
    "Reducing your decision load will have the fastest impact on how energised you feel.",
  dopamine_dependency:
    "Resetting your reward baseline will have the fastest impact on how motivated you feel.",
  recovery_quality:
    "Fixing your recovery quality will have the fastest impact on how rested you feel.",
};

export const QUICK_ACTION_TIPS = {
  attention_fragmentation: [
    { text: "Work in strict 25-minute focus blocks.", icon: "Timer" },
    { text: "Keep your phone in another room.", icon: "Smartphone" },
    { text: "Write down distractions instead of acting on them.", icon: "PenTool" }
  ],
  working_memory: [
    { text: "Write down every open loop in your mind.", icon: "List" },
    { text: "Do one thing at a time. No multitasking.", icon: "Target" },
    { text: "Take 5-minute transition breaks between tasks.", icon: "Coffee" }
  ],
  decision_fatigue: [
    { text: "Pick your outfit and lunch the night before.", icon: "Calendar" },
    { text: "Tackle your hardest choices first thing in the morning.", icon: "Sun" },
    { text: "Set simple defaults for low-stakes decisions.", icon: "CheckCircle2" }
  ],
  dopamine_dependency: [
    { text: "No phone for the first 30 minutes after waking.", icon: "Sunrise" },
    { text: "Turn your phone screen to grayscale mode.", icon: "MonitorOff" },
    { text: "Replace one scroll session with a short walk.", icon: "Activity" }
  ],
  recovery_quality: [
    { text: "Spend 20 minutes doing nothing.", icon: "BatteryCharging" },
    { text: "No screens, no music, no podcasts.", icon: "Music" },
    { text: "Just sit. That's what real rest feels like.", icon: "Wind" }
  ],
};

/** Helper: get severity band for a single dimension score */
export function getDimensionSeverity(score) {
  if (score >= 65) return "high";
  if (score >= 35) return "moderate";
  return "low";
}

/**
 * @param {Object} answers  — { [questionId]: 'never'|'rarely'|'sometimes'|'often'|'always'|null }
 * @returns {Object}        — scored result (see JSDoc above)
 */
export function scoreAnswers(answers = {}) {
  const dimensions = {};

  for (const [dimension, questionIds] of Object.entries(DIMENSION_QUESTIONS)) {
    let raw = 0;
    let answered = 0;

    for (const id of questionIds) {
      const val = answers[id];
      if (val && SCORE_MAP[val] !== undefined) {
        raw += SCORE_MAP[val];
        answered++;
      }
    }

    // If some questions were skipped, pro-rate the max
    const effectiveMax =
      answered > 0
        ? (DIMENSION_MAX[dimension] / questionIds.length) * answered
        : DIMENSION_MAX[dimension];

    dimensions[dimension] =
      answered === 0 ? 0 : Math.round((raw / effectiveMax) * 100);
  }

  // Overall: simple average across all 5 dimensions
  const overall = Math.round(
    Object.values(dimensions).reduce((sum, v) => sum + v, 0) /
      Object.keys(dimensions).length,
  );

  // Dominant dimension — where they score highest
  const dominantDimension = Object.entries(dimensions).reduce(
    (max, [key, val]) => (val > max[1] ? [key, val] : max),
    ["", -1],
  )[0];

  // Severity thresholds
  const severity = overall >= 65 ? "high" : overall >= 35 ? "moderate" : "low";

  return { dimensions, overall, dominantDimension, severity };
}
