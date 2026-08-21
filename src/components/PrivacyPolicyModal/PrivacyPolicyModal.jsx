import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * PrivacyPolicyModal — Renders the full MΛSTISHK privacy policy
 * in an elegant, scrollable overlay modal.
 *
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export default function PrivacyPolicyModal({ isOpen, onClose }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            className="relative z-10 w-full max-w-3xl mx-gutter my-8 max-h-[90vh] overflow-y-auto rounded-lg bg-surface-container-lowest shadow-2xl border border-outline-variant/30"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Privacy Policy"
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-8 py-5 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/20">
              <h2 className="text-headline-md text-primary font-bold">
                Privacy Policy
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-surface-container-high transition-colors group"
                aria-label="Close privacy policy"
              >
                <X
                  size={22}
                  className="text-on-surface-variant group-hover:text-primary transition-colors"
                />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 py-6 privacy-content">
              {/* ── Title Section ── */}
              <div className="mb-8 pb-6 border-b border-outline-variant/20">
                <p className="text-body-lg text-on-surface-variant font-medium italic">
                  MΛSTISHK: Out of the fog. Into the flow.
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-label-sm text-on-surface-variant/70">
                  <span>Effective Date: July 2026</span>
                  <span>Last Updated: July 2026</span>
                </div>
              </div>

              {/* ── Intro ── */}
              <div className="mb-8 p-5 rounded bg-primary-fixed/30 border border-primary-fixed-dim/20">
                <h3 className="text-body-lg font-semibold text-on-surface mb-2">
                  We'll keep this simple and honest.
                </h3>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  At MΛSTISHK, we believe in transparency. You're trusting us with your
                  information, and we take that seriously. This policy explains exactly
                  what we collect, why we collect it, and what we will never do with it.
                </p>
              </div>

              {/* ── Section 1 ── */}
              <PolicySection number="1" title="What We Collect">
                <p className="text-body-md text-on-surface-variant mb-3">
                  When you take the focus check or join our waitlist, we may collect:
                </p>
                <ul className="space-y-2">
                  <PolicyBullet
                    bold="Your name"
                    text="so we know who you are"
                  />
                  <PolicyBullet
                    bold="Your email address or mobile number"
                    text="whichever contact method you choose, so we can reach you when MΛSTISHK is ready"
                  />
                  <PolicyBullet
                    bold="Your survey responses"
                    text="to understand how digital fatigue and focus issues show up for people like you"
                  />
                </ul>
                <p className="text-body-md text-on-surface-variant mt-3 font-medium">
                  That's it. Nothing more.
                </p>
              </PolicySection>

              {/* ── Section 2 ── */}
              <PolicySection number="2" title="Why We Collect It">
                <p className="text-body-md text-on-surface-variant mb-3">
                  We collect this information for one purpose only:
                </p>
                <blockquote className="border-l-4 border-primary pl-4 py-2 my-3 bg-primary-fixed/10 rounded-r">
                  <p className="text-body-md text-on-surface italic">
                    To understand the scale of cognitive fatigue and to keep you informed
                    about MΛSTISHK's progress and launch.
                  </p>
                </blockquote>
                <p className="text-body-md text-on-surface-variant">
                  Your survey responses help us build something that actually works for
                  real people. Your name and contact details ensure we can reach you when
                  we're ready, and only then.
                </p>
              </PolicySection>

              {/* ── Section 3 ── */}
              <PolicySection number="3" title="What We Will Use It For">
                <p className="text-body-md text-on-surface-variant mb-3">
                  We will use your information <strong>only</strong> for:
                </p>
                <ul className="space-y-2">
                  <PolicyBullet text="Sending you updates about MΛSTISHK's development" />
                  <PolicyBullet text="Notifying you when early access or the app is available" />
                  <PolicyBullet text="Sharing findings from our cognitive fatigue research (anonymised and aggregated, never individual)" />
                  <PolicyBullet text="Occasionally sharing relevant insights about cognitive health and mental wellness" />
                </ul>
                <p className="text-body-md text-on-surface-variant mt-3">
                  We will <strong>never</strong> use your information for anything outside of this.
                </p>
              </PolicySection>

              {/* ── Section 4 ── */}
              <PolicySection number="4" title="What We Will Never Do">
                <p className="text-body-md text-on-surface-variant mb-3">
                  We want to be crystal clear:
                </p>
                <ul className="space-y-2.5">
                  <NeverItem text='We will never sell your name, email, or data to anyone' />
                  <NeverItem text='We will never share your personal information with third parties' />
                  <NeverItem text='We will never contact you on behalf of any other brand or product' />
                  <NeverItem text='We will never use your responses to target you with third-party advertising' />
                  <NeverItem text='We will never share your individual survey responses, only anonymised, aggregated insights' />
                </ul>
                <p className="text-body-md text-on-surface-variant mt-4 font-medium italic">
                  Your data belongs to you. We are only borrowing it, with your permission.
                </p>
              </PolicySection>

              {/* ── Section 5 ── */}
              <PolicySection number="5" title="Who Has Access to Your Data">
                <p className="text-body-md text-on-surface-variant">
                  Only the MΛSTISHK core team has access to your information. We do not
                  share it with partners, investors, collaborators, or any external
                  parties, ever.
                </p>
              </PolicySection>

              {/* ── Section 6 ── */}
              <PolicySection number="6" title="How We Store Your Data">
                <p className="text-body-md text-on-surface-variant">
                  Your data is stored securely. We use industry-standard encryption and
                  access controls to ensure your information is protected at all times.
                </p>
              </PolicySection>

              {/* ── Section 7 ── */}
              <PolicySection number="7" title="How Long We Keep It">
                <p className="text-body-md text-on-surface-variant">
                  We will keep your data for as long as MΛSTISHK is active and you remain
                  subscribed to our communications. You can ask us to delete your
                  information at any time, and we will do so promptly, no questions asked.
                </p>
              </PolicySection>

              {/* ── Section 8 ── */}
              <PolicySection number="8" title="Your Rights">
                <p className="text-body-md text-on-surface-variant mb-3">
                  You have the right to:
                </p>
                <ul className="space-y-2">
                  <PolicyBullet bold="Access" text="the data we hold about you" />
                  <PolicyBullet bold="Correct" text="any inaccurate information" />
                  <PolicyBullet bold="Delete" text="your data at any time" />
                  <PolicyBullet bold="Unsubscribe" text="from all communications at any time" />
                </ul>
                <p className="text-body-md text-on-surface-variant mt-3">
                  To exercise any of these rights, simply email us and we will respond
                  within 48 hours.
                </p>
              </PolicySection>

              {/* ── Section 9 ── */}
              <PolicySection number="9" title="Cookies">
                <p className="text-body-md text-on-surface-variant">
                  Our landing page may use minimal cookies only to understand how visitors
                  interact with our site (e.g. which sections are read most). We do not
                  use tracking cookies or third-party advertising cookies.
                </p>
              </PolicySection>

              {/* ── Section 10 ── */}
              <PolicySection number="10" title="Changes to This Policy">
                <p className="text-body-md text-on-surface-variant">
                  If we ever update this policy, we will notify you by email before any
                  changes take effect. We will never change how we use your data without
                  telling you first.
                </p>
              </PolicySection>

              {/* ── Closing Note ── */}
              <div className="mt-10 p-6 rounded-lg bg-primary-fixed/20 border border-primary-fixed-dim/20">
                <h3 className="text-body-lg font-bold text-on-surface mb-3">
                  A Note From Us
                </h3>
                <p className="text-body-md text-on-surface-variant leading-relaxed mb-4">
                  We built MΛSTISHK because we believe people deserve better: a mind
                  that works for them, not against them. The last thing we want is to add
                  to your digital overwhelm with unwanted emails, spam, or data misuse.
                </p>
                <p className="text-body-md text-on-surface-variant leading-relaxed mb-4">
                  You came to us trusting that we care about your mental wellness. We do.
                  And that starts here, with how we treat your information.
                </p>
                <blockquote className="border-l-4 border-primary pl-4 py-2 rounded-r">
                  <p className="text-body-md text-primary font-semibold italic">
                    "Out of the fog. Into the flow." That's our promise to your mind,
                    and to your privacy.
                  </p>
                </blockquote>
              </div>

              {/* ── Footer ── */}
              <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center">
                <p className="text-body-lg font-bold text-primary">MΛSTISHK</p>
                <p className="text-body-md text-on-surface-variant">mastishk.app</p>
                <p className="text-label-sm text-on-surface-variant/60 mt-1 italic">
                  Built for minds like yours.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function PolicySection({ number, title, children }) {
  return (
    <section className="mb-8">
      <h3 className="text-body-lg font-bold text-on-surface mb-3 flex items-baseline gap-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-on-primary text-label-sm font-bold flex-shrink-0">
          {number}
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function PolicyBullet({ bold, text }) {
  return (
    <li className="flex items-start gap-2 text-body-md text-on-surface-variant">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
      <span>
        {bold && <strong className="text-on-surface">{bold} </strong>}
        {text}
      </span>
    </li>
  );
}

function NeverItem({ text }) {
  return (
    <li className="flex items-start gap-2.5 text-body-md text-on-surface-variant">
      <span className="mt-0.5 text-error font-bold text-base flex-shrink-0">✕</span>
      <span>{text}</span>
    </li>
  );
}
