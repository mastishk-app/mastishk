/**
 * Footer with brand name, nav links, and copyright.
 */
import { useState } from 'react';
import wordLogo from '../../assets/images/word_logo.png';
import PrivacyPolicyModal from '../PrivacyPolicyModal/PrivacyPolicyModal';

export default function Footer() {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  return (
    <>
      <footer className="w-full py-xl bg-surface-container-low mt-xl flex flex-col items-center gap-md text-center px-gutter">
        <div className="flex items-center justify-center gap-sm">
          <img
            src={wordLogo}
            alt="MΛSTISHK"
            className="h-10 w-auto object-contain"
          />
        </div>
        <p className="text-body-sm text-on-surface-variant font-medium tracking-wide">
          Out of the Fog. Into the Flow.
        </p>

        <div className="flex flex-wrap justify-center gap-md">
          {/* <a
            href="#"
            className="text-on-surface-variant font-medium hover:text-primary transition-colors"
          >
            Research Ethics
          </a> */}
          <button
            onClick={() => setIsPolicyOpen(true)}
            className="text-on-surface-variant font-medium hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            Privacy Policy
          </button>
          <a
            href="mailto:founders.mastishk@gmail.com"
            className="text-on-surface-variant font-medium hover:text-primary transition-colors"
          >
            Contact Support
          </a>
        </div>

        <p className="text-body-md text-on-surface-variant max-w-xs opacity-80">
          © 2026 MΛSTISHK. Crafted for human minds.
        </p>
      </footer>

      <PrivacyPolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
      />
    </>
  );
}
