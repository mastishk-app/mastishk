import mascot from "../../assets/images/confused_mascot.png";
import { Zap, ArrowRight, Clock, Brain, Smartphone } from "lucide-react";
import { trackEvent } from "../../lib/analytics";

/**
 * Hero section with left-right split layout, headline, subtext, mascot image, CTA button, and stats.
 */
export default function Hero() {
  return (
    <header className="flex flex-col items-center gap-xl mx-auto px-gutter pt-8 md:pt-16 pb-lg w-full">
      <div className="items-center gap-8 grid grid-cols-1 md:grid-cols-2 w-full">
        <div className="flex flex-col items-start gap-6 text-left">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-label-md text-secondary uppercase tracking-widest">
              Out of the Fog. Into the Flow.
            </span>
          </div>

          <h1 className="text-headline-xl text-primary md:text-display-sm leading-tight">
            Does your brain feel like it's running on 12% battery by 3pm?
          </h1>

          <p className="max-w-lg text-body-lg text-on-surface-variant">
            Endless scroll and short-form feeds drain focus. Restora helps you
            measure the damage and rebuild attention.
          </p>

          <div className="inline-block bg-gradient-to-r from-orange-400/80 to-amber-200/80 shadow-[0_0_20px_rgba(255,150,100,0.3)] mt-2 p-[3px] rounded-full transition-all duration-300 hover:scale-105 active:scale-95">
            <a
              href="#survey-anchor"
              onClick={() =>
                trackEvent("Clicked Start Focus Check", { location: "hero" })
              }
              className="flex items-center gap-4 bg-primary py-2 pr-6 pl-2 rounded-full w-full h-full font-bold text-on-primary"
            >
              <div className="flex justify-center items-center bg-white/20 rounded-full w-10 h-10 shrink-0">
                <Zap size={22} color="white" fill="white" />
              </div>
              <span className="text-[17px]">Start the Focus Check</span>
              <ArrowRight size={20} className="ml-2 text-white/80" />
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <img
            src={mascot}
            alt="Restora mascot looking overwhelmed by digital noise"
            className="w-full max-w-sm h-auto animate-gentle-bounce object-contain"
          />
        </div>
      </div>

      {/* Stat cards */}
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-3 mt-sm w-full max-w-4xl">
        {[
          { value: "2.5s", label: "Average attention span today", icon: Clock },
          {
            value: "14%",
            label: "Workers with cognitive fatigue",
            icon: Brain,
          },
          {
            value: "6hrs",
            label: "Daily screen time average",
            icon: Smartphone,
          },
        ].map((stat) => (
          <div
            key={stat.value}
            className="flex flex-row items-center gap-4 bg-surface-container-high p-5 border border-outline-variant/30 rounded-xl text-on-surface transition-transform duration-300 hover:scale-105"
          >
            <div className="flex justify-center items-center bg-primary/10 rounded-full w-14 h-14 shrink-0">
              <stat.icon className="text-3xl text-primary" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="font-bold text-headline-md text-primary leading-tight">
                {stat.value}
              </span>
              <span className="font-medium text-label-md text-on-surface-variant leading-snug">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </header>
  );
}
