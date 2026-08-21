import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   Journey Steps Data
   ───────────────────────────────────────────────────────────── */
const journeySteps = [
  {
    number: 1,
    title: 'Awareness',
    description:
      'Brain fog by noon. Mindless scrolling. Tasks that used to be easy now feel impossible to start.',
    icon: 'eye',
  },
  {
    number: 2,
    title: 'Discovery',
    description:
      'You find MΛSTISHK, built for minds fried by screens, short-form feeds, and always-on digital life.',
    icon: 'search',
  },
  {
    number: 3,
    title: 'The 90-second check',
    description:
      'A short, confidential focus check. No judgment, no sales pitch. Just honest questions about how your mind feels.',
    icon: 'clipboard',
  },
  {
    number: 4,
    title: 'Join the waitlist',
    description:
      "You're in for early access. We'll reach out when MΛSTISHK is ready. No spam, just one message that matters.",
    icon: 'mail',
  },
  {
    number: 5,
    title: 'Your focus map',
    description:
      'MΛSTISHK maps your fatigue patterns and attention habits, then shapes a recovery plan that fits your mind.',
    icon: 'chip',
  },
  {
    number: 6,
    title: 'Daily recovery sessions',
    description:
      'Short sessions help you rebuild focus, quiet the mental noise, and get back into deep work, one day at a time.',
    icon: 'plant',
  },
  {
    number: 7,
    title: 'Flow state restored',
    description:
      'The fog lifts. Focus sticks. Clarity comes back, and this time it stays.',
    icon: 'sun',
  },
];

/* ─────────────────────────────────────────────────────────────
   Animated SVG Icons
   ───────────────────────────────────────────────────────────── */
function JourneyIcon({ type, isActive }) {
  const baseClass = `w-full h-full transition-all duration-700 ${isActive ? 'text-primary' : 'text-outline/60'}`;

  const icons = {
    eye: (
      <svg viewBox="0 0 48 48" fill="none" className={baseClass} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 12C14 12 6 24 6 24s8 12 18 12 18-12 18-12-8-12-18-12Z">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
        </path>
        <circle cx="24" cy="24" r="5">
          <animate attributeName="r" values="5;6;5" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    search: (
      <svg viewBox="0 0 48 48" fill="none" className={baseClass} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="21" cy="21" r="10">
          <animate attributeName="r" values="10;11;10" dur="3s" repeatCount="indefinite" />
        </circle>
        <line x1="29" y1="29" x2="38" y2="38" />
      </svg>
    ),
    clipboard: (
      <svg viewBox="0 0 48 48" fill="none" className={baseClass} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="8" width="28" height="34" rx="3" />
        <path d="M18 8V6a4 4 0 018 0v2" />
        <line x1="16" y1="20" x2="32" y2="20">
          <animate attributeName="x2" values="20;32;20" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="16" y1="26" x2="28" y2="26">
          <animate attributeName="x2" values="16;28;16" dur="2.5s" repeatCount="indefinite" />
        </line>
        <line x1="16" y1="32" x2="24" y2="32">
          <animate attributeName="x2" values="16;24;16" dur="3s" repeatCount="indefinite" />
        </line>
      </svg>
    ),
    mail: (
      <svg viewBox="0 0 48 48" fill="none" className={baseClass} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="12" width="36" height="24" rx="3" />
        <polyline points="6,12 24,28 42,12">
          <animate attributeName="points" values="6,12 24,26 42,12;6,12 24,28 42,12;6,12 24,26 42,12" dur="3s" repeatCount="indefinite" />
        </polyline>
      </svg>
    ),
    chip: (
      <svg viewBox="0 0 48 48" fill="none" className={baseClass} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="12" y="12" width="24" height="24" rx="4" />
        <rect x="18" y="18" width="12" height="12" rx="2">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
        </rect>
        {/* Top pins */}
        <line x1="18" y1="6" x2="18" y2="12" />
        <line x1="24" y1="6" x2="24" y2="12" />
        <line x1="30" y1="6" x2="30" y2="12" />
        {/* Bottom pins */}
        <line x1="18" y1="36" x2="18" y2="42" />
        <line x1="24" y1="36" x2="24" y2="42" />
        <line x1="30" y1="36" x2="30" y2="42" />
        {/* Left pins */}
        <line x1="6" y1="18" x2="12" y2="18" />
        <line x1="6" y1="24" x2="12" y2="24" />
        <line x1="6" y1="30" x2="12" y2="30" />
        {/* Right pins */}
        <line x1="36" y1="18" x2="42" y2="18" />
        <line x1="36" y1="24" x2="42" y2="24" />
        <line x1="36" y1="30" x2="42" y2="30" />
        {/* Pulse dot */}
        <circle cx="24" cy="24" r="2">
          <animate attributeName="r" values="1.5;3;1.5" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    plant: (
      <svg viewBox="0 0 48 48" fill="none" className={baseClass} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 44V22" />
        <path d="M24 30c-8-2-14-10-10-18 6 2 12 8 10 18">
          <animateTransform attributeName="transform" type="rotate" values="-2,24,30;2,24,30;-2,24,30" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M24 24c8-4 16-2 16 8-6 0-14-2-16-8">
          <animateTransform attributeName="transform" type="rotate" values="2,24,24;-2,24,24;2,24,24" dur="3.5s" repeatCount="indefinite" />
        </path>
        <circle cx="20" cy="16" r="1.5" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    sun: (
      <svg viewBox="0 0 48 48" fill="none" className={baseClass} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="8">
          <animate attributeName="r" values="8;9;8" dur="3s" repeatCount="indefinite" />
        </circle>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 24 + Math.cos(rad) * 14;
          const y1 = 24 + Math.sin(rad) * 14;
          const x2 = 24 + Math.cos(rad) * 18;
          const y2 = 24 + Math.sin(rad) * 18;
          return (
            <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2}>
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </line>
          );
        })}
      </svg>
    ),
  };

  return icons[type] || null;
}

/* ─────────────────────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────────────────────── */
export default function UserJourney() {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const stepRefs = useRef([]);
  const [activeStep, setActiveStep] = useState(-1);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  /* ── Scroll progress for the timeline fill ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.3'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  const lineHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  /* ── Intersection Observer for active step ── */
  useEffect(() => {
    const observers = [];
    const visibleSteps = new Set();

    stepRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visibleSteps.add(index);
          } else {
            visibleSteps.delete(index);
          }
          if (visibleSteps.size > 0) {
            setActiveStep(Math.max(...visibleSteps));
          } else {
            setActiveStep(-1);
          }
        },
        { threshold: 0.4, rootMargin: '-10% 0px -30% 0px' }
      );
      observer.observe(ref);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* ── Cursor-following ambient light ── */
  const handleMouseMove = useCallback(
    (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top + window.scrollY - rect.top);
    },
    [mouseX, mouseY]
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-xl px-gutter overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* ── Soft floating background blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute w-[400px] h-[400px] -top-20 -right-20 bg-primary-fixed rounded-full blur-[100px] opacity-20 animate-slow-pulse-8" />
        <div className="absolute w-[350px] h-[350px] top-1/2 -left-32 bg-tertiary-fixed rounded-full blur-[100px] opacity-15 animate-slow-pulse-12" />
        <div className="absolute w-[300px] h-[300px] bottom-20 right-1/4 bg-secondary-fixed rounded-full blur-[90px] opacity-20 animate-slow-pulse-10" />
      </div>

      {/* ── Cursor-following ambient light ── */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none -z-[5]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          background:
            'radial-gradient(circle, rgba(158,61,0,0.06) 0%, rgba(158,61,0,0.02) 40%, transparent 70%)',
        }}
      />

      {/* ── Section Header ── */}
      <motion.div
        className="text-center max-w-2xl mx-auto mb-xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-bold text-label-md text-secondary uppercase tracking-[0.2em]">
          How it works
        </span>
        <h2 className="text-headline-xl text-primary mt-2 mb-3">
          Out of the Fog. Into the Flow.
        </h2>
        <p className="text-body-lg text-on-surface-variant max-w-md mx-auto">
          From &quot;something feels off&quot; to actual mental clarity. Here&apos;s the path.
        </p>
      </motion.div>

      {/* ── Timeline Container ── */}
      <div className="relative w-full mx-auto">
        {/* ── Vertical Timeline Line ── */}
        <div
          ref={timelineRef}
          className="absolute left-[29px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px]"
        >
          {/* Background track */}
          <div className="absolute inset-0 bg-outline-variant/20 rounded-full" />
          {/* Animated fill */}
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-primary to-primary/40 rounded-full origin-top"
            style={{ height: lineHeight }}
          />
        </div>

        {/* ── Steps ── */}
        <div className="relative flex flex-col gap-4">
          {journeySteps.map((step, index) => (
            <TimelineStep
              key={step.number}
              step={step}
              index={index}
              isEven={index % 2 === 0}
              isRevealed={index <= activeStep}
              stepRef={(el) => (stepRefs.current[index] = el)}
            />
          ))}
        </div>
      </div>


    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Timeline Step — per-step scroll-linked opacity
   ───────────────────────────────────────────────────────────── */
function TimelineStep({ step, index, isEven, isRevealed, stepRef }) {
  const ref = useRef(null);

  /* Track how far this step has scrolled through the viewport.
     progress 0   = step's top just entered the bottom of the viewport
     progress 0.5 = step is roughly centered
     progress 1   = step's bottom just left the top of the viewport */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  /* Map scroll progress → opacity:
     0.0 – 0.15 : fade in  (0 → 1)  — entering from bottom
     0.15 – 0.7 : full     (1)      — in view
     0.7 – 1.0  : fade out (1 → 0)  — leaving from top */
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.15, 0.7, 1], [0, 1, 1, 0]);
  const smoothOpacity = useSpring(scrollOpacity, { stiffness: 100, damping: 20 });

  return (
    <motion.div
      ref={(el) => { ref.current = el; stepRef(el); }}
      className="relative"
      style={{ opacity: smoothOpacity }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={{
        hidden: {
          y: 40,
          scale: 0.97,
          transition: { duration: 0.4, ease: [0.4, 0, 1, 1] },
        },
        visible: {
          y: 0,
          scale: 1,
          transition: {
            duration: 0.7,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {/* ── Mobile Layout ── */}
      <div className="flex items-start gap-5 md:hidden">
        {/* Icon node */}
        <div className="relative flex-shrink-0 z-10">
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={
              isRevealed
                ? {
                    boxShadow: [
                      '0 0 0px 0px rgba(158,61,0,0)',
                      '0 0 16px 3px rgba(158,61,0,0.12)',
                      '0 0 0px 0px rgba(158,61,0,0)',
                    ],
                  }
                : {}
            }
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div
            className={`w-[60px] h-[60px] rounded-2xl border-2 flex items-center justify-center p-3 transition-all duration-700 ${
              isRevealed
                ? 'bg-surface-container-lowest border-primary/30 shadow-lg'
                : 'bg-surface-container border-outline-variant/20'
            }`}
          >
            <JourneyIcon type={step.icon} isActive={isRevealed} />
          </div>
        </div>

        {/* Content */}
        <motion.div
          className={`flex-1 p-5 rounded-xl backdrop-blur-md border transition-all duration-500 ${
            isRevealed
              ? 'bg-surface-container-lowest/70 border-primary/15 shadow-[0_8px_32px_-8px_rgba(158,61,0,0.08)]'
              : 'bg-surface-container/40 border-outline-variant/10'
          }`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={{
            hidden: { x: 20, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
            visible: { x: 0, transition: { duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] } },
          }}
          whileHover={{ scale: 1.01 }}
        >
          <h3
            className={`text-body-lg font-bold mb-1.5 transition-colors duration-500 ${
              isRevealed ? 'text-on-surface' : 'text-on-surface-variant/60'
            }`}
          >
            {step.title}
          </h3>
          <p
            className={`text-body-md leading-relaxed transition-colors duration-500 ${
              isRevealed ? 'text-on-surface-variant' : 'text-on-surface-variant/40'
            }`}
          >
            {step.description}
          </p>
        </motion.div>
      </div>

      {/* ── Desktop Layout (3-column grid) ── */}
      <div className="hidden md:grid md:grid-cols-[1fr_100px_1fr] md:items-start md:gap-0">
        {/* Left column */}
        <div className={`${isEven ? 'pr-6' : ''}`}>
          {isEven && (
            <motion.div
              className={`p-6 rounded-xl backdrop-blur-md border transition-all duration-500 cursor-default text-right ${
                isRevealed
                  ? 'bg-surface-container-lowest/70 border-primary/15 shadow-[0_8px_32px_-8px_rgba(158,61,0,0.08)] hover:shadow-[0_12px_40px_-8px_rgba(158,61,0,0.14)] hover:-translate-y-1'
                  : 'bg-surface-container/40 border-outline-variant/10'
              }`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={{
                hidden: { x: -30, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
                visible: { x: 0, transition: { duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] } },
              }}
              whileHover={{ scale: 1.015 }}
            >
              <h3
                className={`text-body-lg font-bold mb-2 transition-colors duration-500 ${
                  isRevealed ? 'text-on-surface' : 'text-on-surface-variant/60'
                }`}
              >
                {step.title}
              </h3>
              <p
                className={`text-body-md leading-relaxed transition-colors duration-500 ${
                  isRevealed ? 'text-on-surface-variant' : 'text-on-surface-variant/40'
                }`}
              >
                {step.description}
              </p>
            </motion.div>
          )}
        </div>

        {/* Center column — Icon node */}
        <div className="flex justify-center relative z-10">
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-[20px]"
              animate={
                isRevealed
                  ? {
                      boxShadow: [
                        '0 0 0px 0px rgba(158,61,0,0)',
                        '0 0 20px 4px rgba(158,61,0,0.15)',
                        '0 0 0px 0px rgba(158,61,0,0)',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div
              className={`w-[80px] h-[80px] rounded-[20px] border-2 flex items-center justify-center p-4 transition-all duration-700 ${
                isRevealed
                  ? 'bg-surface-container-lowest border-primary/30 shadow-lg'
                  : 'bg-surface-container border-outline-variant/20'
              }`}
            >
              <JourneyIcon type={step.icon} isActive={isRevealed} />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className={`${!isEven ? 'pl-6' : ''}`}>
          {!isEven && (
            <motion.div
              className={`p-6 rounded-xl backdrop-blur-md border transition-all duration-500 cursor-default text-left ${
                isRevealed
                  ? 'bg-surface-container-lowest/70 border-primary/15 shadow-[0_8px_32px_-8px_rgba(158,61,0,0.08)] hover:shadow-[0_12px_40px_-8px_rgba(158,61,0,0.14)] hover:-translate-y-1'
                  : 'bg-surface-container/40 border-outline-variant/10'
              }`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={{
                hidden: { x: 30, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
                visible: { x: 0, transition: { duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] } },
              }}
              whileHover={{ scale: 1.015 }}
            >
              <h3
                className={`text-body-lg font-bold mb-2 transition-colors duration-500 ${
                  isRevealed ? 'text-on-surface' : 'text-on-surface-variant/60'
                }`}
              >
                {step.title}
              </h3>
              <p
                className={`text-body-md leading-relaxed transition-colors duration-500 ${
                  isRevealed ? 'text-on-surface-variant' : 'text-on-surface-variant/40'
                }`}
              >
                {step.description}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
