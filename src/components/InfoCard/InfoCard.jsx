import { TbBrain, TbDeviceMobile, TbFocus2 } from 'react-icons/tb';

const symptoms = [
  {
    icon: TbBrain,
    title: 'Constant brain fog',
    description:
      'You sit down to think, and your mind goes blank within seconds.',
  },
  {
    icon: TbDeviceMobile,
    title: "Can't stop scrolling",
    description:
      'You open the app for a minute and lose half an hour.',
  },
  {
    icon: TbFocus2,
    title: "Focus won't stick",
    description:
      'Deep work feels impossible. Every task takes twice as long.',
  },
];

/**
 * "Sound Familiar?" symptom cards section.
 * Uses the page's existing warm theme tokens.
 */
export default function InfoCard() {
  return (
    <section className="w-full mb-xl opacity-0 animate-fade-in-up">
      <h2 className="text-label-md uppercase tracking-widest text-secondary text-center mb-3">
        Sound familiar?
      </h2>
      <p className="text-body-md text-on-surface-variant text-center mb-8 max-w-md mx-auto">
        If any of these hit home, you&apos;re not alone.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {symptoms.map((symptom) => (
            <div
              key={symptom.title}
              className="bg-surface-container-low rounded-xl p-6 flex flex-col gap-3 border border-outline-variant/20 transition-transform duration-300 hover:scale-[1.03]"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center">
                <symptom.icon size={20} className="text-primary" />
              </div>
              <h3 className="text-body-md font-bold text-on-surface">
                {symptom.title}
              </h3>
              <p className="text-label-md font-normal text-on-surface-variant leading-relaxed">
                {symptom.description}
              </p>
            </div>
          ))}
        </div>
    </section>
  );
}
