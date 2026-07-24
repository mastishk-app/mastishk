/**
 * Restora — cognitive self-assessment question bank.
 *
 * 12 questions across 5 clinically-grounded dimensions.
 * Each dimension maps to a distinct recovery protocol in the product.
 *
 * Scoring per answer (used in ResultTeaser / score calculation):
 *   never: 0 | rarely: 1 | sometimes: 2 | often: 3 | always: 4
 *
 * Dimension max scores:
 *   attention_fragmentation  → 3 questions → max 12
 *   working_memory           → 2 questions → max 8
 *   decision_fatigue         → 2 questions → max 8
 *   dopamine_dependency      → 2 questions → max 8
 *   recovery_quality         → 3 questions → max 12
 *
 * Normalise each to 0–100 before displaying the radar chart.
 *
 * Icon keys map to react-icons/md — see QuestionCard.jsx iconMap.
 */

const questions = [
  // ── Dimension 1: Attention Fragmentation ──────────────────────────────────

  {
    id: "q1",
    dimension: "attention_fragmentation",
    category: "Attention Fragmentation",
    icon: "swap_horiz",
    text: "I open an app with a clear intention, but end up doing something completely different within 30 seconds.",
    insight:
      "Measures task-switching compulsion. Think about the last time you unlocked your phone? Did you do what you meant to?",
  },
  {
    id: "q2",
    dimension: "attention_fragmentation",
    category: "Attention Fragmentation",
    icon: "menu_book",
    text: "When reading, I reach the end of a paragraph and realise I absorbed nothing, so I re-read it again.",
    insight:
      "Tests reading comprehension loss. Recall your last article or book. How often did your eyes move but your mind didn't?",
  },
  {
    id: "q3",
    dimension: "attention_fragmentation",
    category: "Attention Fragmentation",
    icon: "phone_iphone",
    text: "I feel a pull to check my phone even in situations where I know there's nothing new: a meal, a meeting, a conversation.",
    insight:
      "Detects compulsive checking urges. Picture a quiet dinner. Do your hands reach for your pocket out of habit?",
  },

  // ── Dimension 2: Working Memory Strain ────────────────────────────────────

  {
    id: "q4",
    dimension: "working_memory",
    category: "Working Memory",
    icon: "psychology",
    text: "I walk into a room and forget why I went there, or I start a sentence and lose the point before I finish it.",
    insight:
      "Gauges working memory overload. Think of today. Did you lose a thought mid-sentence or forget why you stood up?",
  },
  {
    id: "q5",
    dimension: "working_memory",
    category: "Working Memory",
    icon: "mail_outline",
    text: "I need to re-read messages or instructions multiple times before I can act on them.",
    insight:
      "Tests information retention under load. Consider your last email or text. Could you act on it after one read?",
  },

  // ── Dimension 3: Decision Fatigue ─────────────────────────────────────────

  {
    id: "q6",
    dimension: "decision_fatigue",
    category: "Decision Fatigue",
    icon: "restaurant_menu",
    text: "By the afternoon, small decisions (what to eat, which task to tackle next) feel disproportionately exhausting.",
    insight:
      "Measures afternoon mental depletion. Think about yesterday's lunch. Did choosing what to eat feel harder than it should?",
  },
  {
    id: "q7",
    dimension: "decision_fatigue",
    category: "Decision Fatigue",
    icon: "device_hub",
    text: "When given too many options (a menu, a playlist, a list of tasks), I feel mentally stuck and often give up or just pick randomly.",
    insight:
      "Detects choice paralysis. Recall the last time you faced many options. Did you freeze, stall, or just pick anything?",
  },

  // ── Dimension 4: Dopamine Loop Dependency ─────────────────────────────────

  {
    id: "q8",
    dimension: "dopamine_dependency",
    category: "Dopamine Dependency",
    icon: "slow_motion_video",
    text: "Long-form content (a book, a documentary, a 20-minute video) feels too slow or boring, even when I know I'd enjoy it.",
    insight:
      "Reveals shifted dopamine baseline. Think of a film or book you loved. Does the idea of starting it now feel like effort?",
  },
  {
    id: "q9",
    dimension: "dopamine_dependency",
    category: "Dopamine Dependency",
    icon: "smart_display",
    text: "I scroll through short videos or posts feeling vaguely dissatisfied, but I keep going anyway, searching for something that never arrives.",
    insight:
      "Captures the doom-scroll loop. Remember your last scroll session. Were you enjoying it, or just hoping the next one would hit?",
  },

  // ── Dimension 5: Cognitive Recovery Quality ───────────────────────────────

  {
    id: "q10",
    dimension: "recovery_quality",
    category: "Recovery Quality",
    icon: "free_cancellation",
    text: "During breaks (lunch, commute, before sleep), I instinctively reach for my phone rather than just sitting with my thoughts.",
    insight:
      "Tests whether rest is truly restful. During your last break, did you sit quietly, or fill the silence with a screen?",
  },
  {
    id: "q11",
    dimension: "recovery_quality",
    category: "Recovery Quality",
    icon: "bedtime",
    text: "After a full night's sleep, I wake up feeling mentally fuzzy or unrefreshed, like my brain didn't fully reset.",
    insight:
      "Checks overnight cognitive recovery. Think about this morning. Did you wake up sharp, or did the fog linger?",
  },
  {
    id: "q12",
    dimension: "recovery_quality",
    category: "Recovery Quality",
    icon: "self_improvement",
    text: "Silence, stillness, or unstructured time feels uncomfortable to me. I need stimulation to feel okay doing nothing.",
    insight:
      "Measures tolerance for stillness. Imagine five minutes with nothing to do and no phone. Does that feel peaceful or unbearable?",
  },
];

export default questions;
