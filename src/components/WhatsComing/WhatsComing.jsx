import { useState, useEffect, useCallback } from "react";
import {
  Bug,
  Smartphone,
  PenLine,
  Puzzle,
  MessagesSquare,
  Heart,
  Check,
  Loader2,
} from "lucide-react";
import supabase from "../../lib/supabase";
import { trackEvent } from "../../lib/analytics";

const FEATURES = [
  {
    id: 'ai-chat-debug',
    icon: Bug,
    title: 'Spot the Slip',
    description:
      'Live chat sessions where the bot slips on purpose — catch the mistakes mid-conversation before they slide by.',
    accent: 'bg-primary-fixed',
  },
  {
    id: 'doomscroll-gate',
    icon: Smartphone,
    title: 'Doomscroll Gate',
    description:
      'Open a distraction app only after answering a few questions — difficulty rises each time you try.',
    accent: 'bg-secondary-fixed',
  },
  {
    id: 'freewrite-sprint',
    icon: PenLine,
    title: 'Freewrite Sprint',
    description:
      'Write with a 5-second pause limit — stop overthinking, or lose the draft and start fresh.',
    accent: 'bg-primary-fixed',
  },
  {
    id: 'brain-warmup',
    icon: Puzzle,
    title: 'Brain Warmups',
    description:
      'Quick crosswords and mini puzzles to wake up focus before deep work.',
    accent: 'bg-primary-fixed',
  },
  {
    id: 'brainstormer',
    icon: MessagesSquare,
    title: 'Brainstormer',
    description:
      "A thinking companion that won't hand you answers — it helps you think the solution through yourself.",
    accent: 'bg-secondary-fixed',
  },
];

const LOVED_KEY = "restora_feature_loves";

function getLovedIds() {
  try {
    const raw = localStorage.getItem(LOVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistLovedId(id) {
  const next = [...new Set([...getLovedIds(), id])];
  localStorage.setItem(LOVED_KEY, JSON.stringify(next));
  return next;
}

function FeatureCard({ feature, loved, busy, onLove }) {
  const Icon = feature.icon;

  return (
    <div className="flex flex-col gap-4 bg-surface-container-low hover:shadow-[0_8px_32px_-8px_rgba(158,61,0,0.1)] p-6 border border-outline-variant/20 rounded-xl transition-all duration-300 hover:scale-[1.02]">
      <div
        className={`w-12 h-12 rounded-xl ${feature.accent} flex items-center justify-center`}
      >
        <Icon size={22} className="text-primary" strokeWidth={1.75} />
      </div>

      <div className="flex flex-col flex-1 gap-2">
        <h3 className="font-bold text-body-md text-on-surface">
          {feature.title}
        </h3>
        <p className="font-normal text-label-md text-on-surface-variant leading-relaxed">
          {feature.description}
        </p>
      </div>

      <button
        type="button"
        disabled={loved || busy}
        onClick={() => onLove(feature.id)}
        className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-label-md font-semibold transition-all duration-300 ${
          loved
            ? "bg-primary/10 text-primary cursor-default"
            : "bg-primary text-on-primary hover:scale-105 bloom-shadow-primary disabled:opacity-60"
        }`}
      >
        {busy ? (
          <Loader2 size={16} className="animate-spin" />
        ) : loved ? (
          <Check size={16} />
        ) : (
          <Heart size={16} />
        )}
        {loved ? "Loved!" : "I love this!"}
      </button>
    </div>
  );
}

/**
 * "What's Coming" — upcoming feature ideas with love impressions.
 */
export default function WhatsComing() {
  const [loved, setLoved] = useState([]);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    setLoved(getLovedIds());
  }, []);

  const handleLove = useCallback(
    async (featureId) => {
      if (loved.includes(featureId) || busyId) return;

      setBusyId(featureId);
      trackEvent("Feature Loved", { feature_id: featureId });

      try {
        const { error } = await supabase.from("feature_loves").insert([
          {
            feature_id: featureId,
            session_token:
              localStorage.getItem("restora_session_token") || null,
          },
        ]);

        if (error) throw error;

        setLoved(persistLovedId(featureId));
      } catch (err) {
        console.error("[WhatsComing] Failed to save love:", err);
        // Still mark locally so UX isn't blocked if Supabase isn't migrated yet
        setLoved(persistLovedId(featureId));
      } finally {
        setBusyId(null);
      }
    },
    [loved, busyId],
  );

  return (
    <section id="whats-coming" className="relative py-xl w-full overflow-hidden scroll-mt-24">
      <div className="-top-24 -right-24 bg-primary-fixed/40 absolute blur-3xl rounded-full w-72 h-72 animate-slow-pulse-8 pointer-events-none" />
      <div className="-bottom-16 -left-16 bg-tertiary-fixed/30 absolute blur-3xl rounded-full w-56 h-56 animate-slow-pulse-12 pointer-events-none" />

      <div className="relative mx-auto mb-10 max-w-2xl text-center">
        <p className="mb-3 text-label-md text-secondary uppercase tracking-[0.2em]">
          On the roadmap
        </p>
        <h2 className="mb-4 text-headline-xl text-primary">
          What&apos;s coming
        </h2>
        <p className="text-body-lg text-on-surface-variant">
          Ideas we&apos;re building. Tap the ones you want most — your vote
          shapes the product.
        </p>
      </div>

      <div className="relative gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            loved={loved.includes(feature.id)}
            busy={busyId === feature.id}
            onLove={handleLove}
          />
        ))}
      </div>

      <p className="relative mt-10 text-center text-body-md text-on-surface-variant">
        And still cooking — a whole kitchen of focus tools is simmering behind the scenes.
      </p>
    </section>
  );
}
