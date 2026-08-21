import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  Target,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import mascot from '../assets/images/thinking_mascot.png';

/**
 * AboutUs — Dedicated page explaining MΛSTISHK's mission, vision, values,
 * and the team behind it. Follows the same warm, minimal design language.
 */
export default function AboutUsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative pt-[110px] pb-xl w-[85%] mx-auto">
     

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — What is MΛSTISHK?
          ═══════════════════════════════════════════════════════════ */}
      <section className="px-gutter w-full mx-auto mb-xl">
        {/* Hero area */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex flex-col gap-5">
            <span className="font-bold text-label-md text-secondary uppercase tracking-widest">
              About MΛSTISHK
            </span>
            <h1 className="text-headline-xl text-primary leading-tight">
              Reclaiming minds in the age of digital fog.
            </h1>
            <p className="text-body-lg text-on-surface-variant leading-relaxed max-w-lg">
              MΛSTISHK isn&apos;t another guilt-trip wellness app. It&apos;s a playful,
              practical way to figure out why your focus is fried, and help you get
              it back.
            </p>
          </div>

          <motion.div
            className="flex justify-center md:justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <img
              src={mascot}
              alt="MΛSTISHK mascot thinking through digital fog"
              className="w-full max-w-xs h-auto object-contain"
            />
          </motion.div>
        </motion.div>


        {/* The Story */}
        <motion.div
          className="p-8 rounded-lg bg-surface-container-low border border-outline-variant/20 mb-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-headline-md text-primary font-bold mb-4 flex items-center gap-2">
            <Lightbulb size={22} className="text-primary" />
            The Story Behind MΛSTISHK
          </h2>
          <div className="space-y-4 text-body-md text-on-surface-variant leading-relaxed">
            <p>
              It started with a simple observation: smart, capable people were
              struggling to think clearly. Not because something was &quot;wrong&quot; with
              them, but because modern life had quietly drained their mental battery.
            </p>
            <p>
              Endless notifications, feeds built to steal attention, and constant
              tab-switching created a new kind of exhaustion, the kind that doesn&apos;t
              show up on a medical test, but hits hard by 3pm.
            </p>
            <p>
              So before we built a bunch of features, we decided to listen. MΛSTISHK
              starts by talking to real people, learning how focus actually breaks,
              and building tools that feel human, not preachy.
            </p>
          </div>
        </motion.div>

        {/* Our Goal */}
        <motion.div
          className="p-8 rounded-lg bg-surface-container-high border border-outline-variant/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-headline-md text-primary font-bold mb-4 flex items-center gap-2">
            <Target size={22} className="text-primary" />
            Our Goal
          </h2>
          <div className="space-y-4 text-body-md text-on-surface-variant leading-relaxed">
            <p>
              Map how digital life drains focus, then build tools that help you
              get it back. Simple as that.
            </p>
            <p>
              We&apos;re not here to shame your screen time. We&apos;re here to make deep
              focus feel possible again, one small habit at a time.
            </p>
          </div>
        </motion.div>

      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — Meet the Team
          ═══════════════════════════════════════════════════════════ */}
      <section className="px-gutter w-full mx-auto mb-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <span className="font-bold text-label-md text-secondary uppercase tracking-widest">
              The People
            </span>
            <h2 className="text-headline-xl text-primary mt-2">
              Meet the Team
            </h2>
            <p className="text-body-lg text-on-surface-variant mt-3 max-w-xl mx-auto">
              A small, passionate group united by one belief: your mind deserves better.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {teamMembers.map((member, index) => (
              <TeamCard key={member.name} member={member} delay={index * 0.1} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — Join the Movement CTA
          ═══════════════════════════════════════════════════════════ */}
      <section className="px-gutter w-full mx-auto">
        <motion.div
          className="relative overflow-hidden rounded-lg p-10 text-center bg-gradient-to-br from-primary-fixed via-secondary-fixed to-tertiary-fixed/40 border border-outline-variant/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles
            size={32}
            className="mx-auto text-primary mb-4 opacity-60"
          />
          <h2 className="text-headline-md text-on-surface font-bold mb-3">
            Come Build This With Us
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-md mx-auto mb-6">
            Your 90-second focus check helps us understand what people actually
            need. Every response shapes what we build next.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-md py-[12px] rounded-full text-label-md font-bold hover:bg-primary/90 transition-colors shadow-sm"
          >
            Start the Focus Check
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}

/* ── Team Data ─────────────────────────────────────────────── */
const teamMembers = [
  {
    name: 'Priyanshi Jain',
    role: 'Founder',
    bio: 'Engineer obsessed with how tech shapes the mind. Designs the product experience so MΛSTISHK feels calm, clear, and actually usable.',
    initials: 'PJ',
  },
  {
    name: 'Mehul Sharma',
    role: 'Founder',
    bio: 'Builder who got tired of losing whole evenings to the scroll. Handles the systems side so the focus tools you want can actually ship.',
    initials: 'MS',
  },
];

/* ── Sub-components ─────────────────────────────────────────── */

function TeamCard({ member, delay }) {
  return (
    <motion.div
      className="bg-surface-container-high rounded-xl p-6 flex flex-col items-center text-center gap-4 border border-outline-variant/20 transition-transform duration-300 hover:scale-[1.03]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay }}
    >
      {/* Avatar with initials */}
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-md">
        <span className="text-headline-md text-on-primary font-bold">
          {member.initials}
        </span>
      </div>

      <div>
        <h3 className="text-body-lg font-bold text-on-surface">{member.name}</h3>
        <p className="text-label-md text-primary font-semibold mt-0.5">
          {member.role}
        </p>
      </div>

      <p className="text-body-md text-on-surface-variant leading-relaxed">
        {member.bio}
      </p>
    </motion.div>
  );
}
