import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuestionCard from "../QuestionCard/QuestionCard";
import ResultTeaser from "../ResultTeaser/ResultTeaser";
import supabase from "../../lib/supabase";
import { scoreAnswers, DIMENSION_LABELS } from "../../lib/scoreAnswersService";
import { trackEvent, identifyUser } from "../../lib/analytics";
import PhoneInput, {
  isValidPhoneNumber,
  getCountryCallingCode,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";

const CustomCountrySelect = ({
  value,
  onChange,
  labels,
  options,
  iconComponent: Icon,
  ...rest
}) => (
  <div className="relative flex items-center bg-[#f4ece3]/40 hover:bg-[#f4ece3]/70 px-4 border-[#f4ece3] border-r-2 transition-colors">
    <select
      {...rest}
      className="z-10 absolute inset-0 opacity-0 w-full h-full cursor-pointer"
      value={value || ""}
      onChange={(event) => onChange(event.target.value || undefined)}
    >
      <option value="">{labels?.["ZZ"] || "Select"}</option>
      {options.map((option) => (
        <option key={option.value || "ZZ"} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div className="flex items-center gap-2 pointer-events-none">
      {Icon && (
        <Icon
          country={value}
          label={value}
          className="shadow-sm border border-black/5 w-6 h-4"
        />
      )}
      <div className="opacity-70 border-[#8c6b5d] border-r-[1.5px] border-b-[1.5px] w-1.5 h-1.5 -translate-y-0.5 rotate-45" />
      {value && (
        <span className="ml-2 font-semibold text-[15px] text-on-surface tracking-wide">
          +{getCountryCallingCode(value)}
        </span>
      )}
    </div>
  </div>
);
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdSend,
  MdCheckCircle,
  MdErrorOutline,
  MdArrowForward,
  MdArrowBack,
  MdAccessTime,
  MdSpa,
  MdAutoStories,
  MdPsychologyAlt,
  MdRestaurantMenu,
  MdCloud,
  MdSmartDisplay,
  MdBolt,
  MdSwapHoriz,
  MdMenuBook,
  MdPhoneIphone,
  MdPsychology,
  MdMailOutline,
  MdDeviceHub,
  MdSlowMotionVideo,
  MdFreeCancellation,
  MdBedtime,
  MdSelfImprovement,
} from "react-icons/md";

const iconMap = {
  // Legacy keys (kept for compatibility)
  auto_stories: MdAutoStories,
  psychology_alt: MdPsychologyAlt,
  cloud: MdCloud,
  bolt: MdBolt,
  // Active keys used in questions.js
  swap_horiz: MdSwapHoriz,
  menu_book: MdMenuBook,
  phone_iphone: MdPhoneIphone,
  psychology: MdPsychology,
  mail_outline: MdMailOutline,
  restaurant_menu: MdRestaurantMenu,
  device_hub: MdDeviceHub,
  slow_motion_video: MdSlowMotionVideo,
  smart_display: MdSmartDisplay,
  free_cancellation: MdFreeCancellation,
  bedtime: MdBedtime,
  self_improvement: MdSelfImprovement,
};

/**
 * Step-by-step questionnaire form section.
 * Step 0: Personal info
 * Step 1..N: Questions
 */
export default function SurveySection({ questions = [] }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    trackEvent("Survey Intro Viewed");

    const initSession = async () => {
      const storedToken = localStorage.getItem("mastishk_session_token");
      if (storedToken) {
        setSessionToken(storedToken);
        const { data, error } = await supabase.rpc("get_my_survey", {
          token: storedToken,
        });

        if (!error && data && data.length > 0) {
          const userResponse = data[0];
          setName(userResponse.name);
          setContactMethod(userResponse.contact_method);
          setContactValue(userResponse.contact_value);
          setAnswers(userResponse.answers || {});
          setReferralCode(userResponse.referral_code);

          const ansKeys = Object.keys(userResponse.answers || {});
          const minReq = Math.min(3, questions.length);
          if (ansKeys.length >= minReq) {
            setAlreadyWaitlisted(true);
            const result = scoreAnswers(userResponse.answers || {});
            setScoreResult(result);
            setSubmitted(true);
            setShowResultTeaser(false);
          } else {
            const nextQIndex = questions.findIndex(
              (q) => !(userResponse.answers || {})[q.id],
            );
            setCurrentStep(
              nextQIndex === -1 ? questions.length : nextQIndex + 1,
            );
          }
        } else {
          localStorage.removeItem("mastishk_session_token");
          setSessionToken("");
        }
      }
    };
    initSession();
  }, [questions]);
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState(""); // '' | 'email' | 'mobile'
  const [contactValue, setContactValue] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showResultTeaser, setShowResultTeaser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [scoreResult, setScoreResult] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [alreadyWaitlisted, setAlreadyWaitlisted] = useState(false);

  // Track drop-offs
  const currentStepRef = useRef(currentStep);
  const submittedRef = useRef(submitted);

  useEffect(() => {
    currentStepRef.current = currentStep;
    submittedRef.current = submitted;
  }, [currentStep, submitted]);

  useEffect(() => {
    const handleDropOff = () => {
      // If user passed the personal info step but didn't submit
      if (currentStepRef.current > 0 && !submittedRef.current) {
        trackEvent("Survey Drop Off", {
          drop_off_step: currentStepRef.current,
        });
      }
    };

    window.addEventListener("beforeunload", handleDropOff);
    return () => {
      window.removeEventListener("beforeunload", handleDropOff);
      handleDropOff(); // Fire on unmount as well
    };
  }, []);

  const totalSteps = questions.length + 1; // 1 for personal info

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev, [questionId]: answer };
      if (sessionToken) {
        supabase
          .rpc("update_my_answers", {
            token: sessionToken,
            new_answers: newAnswers,
          })
          .then(({ error }) => {
            if (error) console.error("Error updating answers:", error);
          });
      }
      return newAnswers;
    });

    const question = questions.find((q) => q.id === questionId);
    trackEvent("Question Answered", {
      question_id: questionId,
      question_category: question?.category,
      answer_value: answer,
    });
  };

  const isPersonalInfoValid = (() => {
    if (name.trim() === "") return false;
    if (contactMethod === "") return false;
    if (contactMethod === "email") {
      return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(contactValue);
    }
    if (contactMethod === "mobile") {
      return contactValue ? isValidPhoneNumber(contactValue) : false;
    }
    return false;
  })();

  const handleNext = async () => {
    if (currentStep === 0 && !isPersonalInfoValid) return;

    if (currentStep === 0) {
      if (!sessionToken) {
        setIsSubmitting(true);
        const generateUUID = () => {
          return typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
                const r = (Math.random() * 16) | 0;
                const v = c === "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
              });
        };
        const newToken = generateUUID();
        const newReferralCode = Math.random().toString(36).substring(2, 10);
        const urlParams = new URLSearchParams(window.location.search);
        const referredBy = urlParams.get("ref");

        const { error } = await supabase.from("survey_responses").insert([
          {
            name: name.trim(),
            contact_method: contactMethod,
            contact_value: contactValue.trim(),
            answers: answers,
            referral_code: newReferralCode,
            referred_by: referredBy || null,
            session_token: newToken,
          },
        ]);

        if (error) {
          console.error("Insert error:", error);
          setSubmitError("Failed to start. Please try again.");
          setIsSubmitting(false);
          return;
        }

        setSessionToken(newToken);
        setReferralCode(newReferralCode);
        localStorage.setItem("mastishk_session_token", newToken);
        setIsSubmitting(false);
      }

      identifyUser(contactValue.trim(), {
        name: name.trim(),
        contact_method: contactMethod,
      });
      trackEvent("Survey Started", {
        total_questions: questions.length,
      });
    }

    setCurrentStep((prev) => (prev < totalSteps - 1 ? prev + 1 : prev));
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const answeredCount = Object.keys(answers).length;
  // Let's stick with a minimum number of required questions, e.g. 3,
  // or require all questions if it's step-by-step. Let's stick to 3 like the original.
  const minRequired = Math.min(3, questions.length);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isPersonalInfoValid) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      if (sessionToken) {
        const { error } = await supabase.rpc("update_my_answers", {
          token: sessionToken,
          new_answers: answers,
        });
        if (error) throw error;
      }

      const result = scoreAnswers(answers);
      setScoreResult(result);
      setSubmitted(true);
      setShowResultTeaser(true);

      trackEvent("Survey Completed", {
        total_answered: Object.keys(answers).length,
        overall_score: result.overallScore,
        dominant_dimension: result.dominantDimension,
        severity: result.severity,
        referred_by: referredBy || null,
      });
    } catch (err) {
      console.error("Supabase insert error:", err);
      setSubmitError(err.message || "Something went wrong. Please try again.");

      trackEvent("Survey Error", {
        error_message: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        {showResultTeaser && (
          <ResultTeaser
            name={name}
            contactMethod={contactMethod}
            contactValue={contactValue}
            scoreResult={scoreResult}
            referralCode={referralCode}
            alreadyWaitlisted={alreadyWaitlisted}
            onDismiss={() => setShowResultTeaser(false)}
          />
        )}
        <section
          id="survey-anchor"
          className="flex flex-col justify-center items-center mx-auto px-gutter py-2 w-full min-h-[calc(100vh-120px)]"
        >
          <div className="relative bg-surface shadow-md p-8 md:p-12 border-[#f4ece3] border-2 rounded-3xl w-full max-w-[700px] text-center glass-panel">
            <div className="flex justify-center items-center bg-green-100 mx-auto mb-6 rounded-full w-16 h-16">
              <MdCheckCircle size={36} className="text-green-600" />
            </div>
            <h2 className="mb-3 font-bold text-headline-md text-primary md:text-headline-lg">
              You&apos;re already on the waitlist
            </h2>
            <p className="mx-auto mb-8 max-w-md text-body-md text-on-surface-variant leading-relaxed">
              {name ? `${name}, w` : "W"}e&apos;ve got your spot saved.
              We&apos;ll reach out when MΛSTISHK is ready. No need to fill this
              out again.
            </p>
            <div className="flex sm:flex-row flex-col justify-center gap-3">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("whats-coming")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="inline-flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 shadow-sm px-6 py-3 rounded-full font-bold text-label-md text-on-primary transition-colors"
              >
                See what&apos;s coming
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  // Figure out if we can go to next based on step
  let canGoNext = false;
  if (currentStep === 0) {
    canGoNext = isPersonalInfoValid;
  } else {
    const currentQuestion = questions[currentStep - 1];
    canGoNext =
      answers[currentQuestion?.id] !== undefined &&
      answers[currentQuestion?.id] !== null;
  }

  return (
    <section
      id="survey-anchor"
      className="flex flex-col justify-center items-center mx-auto px-gutter py-2 w-full min-h-[calc(100vh-120px)]"
    >
      {/* Progress Indicator */}
      <div className="flex flex-col items-center mb-md w-full">
        <div className="mb-sm font-semibold text-body-md text-on-surface">
          Step {currentStep + 1} of {totalSteps}
        </div>
        <div className="relative bg-[#f4ece3] mb-3 rounded-full w-full max-w-md h-2 overflow-hidden">
          <div
            className="top-0 bottom-0 left-0 absolute bg-[#b64b16] rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: "var(--color-primary, #b64b16)",
            }}
          />
        </div>
        <div className="flex items-center gap-1 font-medium text-on-surface-variant text-sm">
          <MdAccessTime size={16} />
          <span>
            {currentStep === 0
              ? "About 90 seconds total"
              : currentStep >= totalSteps - 1
                ? "Almost done"
                : `About ${Math.max(15, Math.round(((totalSteps - 1 - currentStep) / Math.max(1, totalSteps - 1)) * 90))} seconds left`}
          </span>
        </div>
      </div>

      <div className="relative bg-surface shadow-md p-5 md:p-8 border-[#f4ece3] border-2 rounded-3xl w-full max-w-[700px] glass-panel">
        <AnimatePresence mode="wait">
          {/* Step 0: Personal Info */}
          {currentStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
              }}
              exit={{
                opacity: 0,
                y: -10,
                transition: { duration: 0.25, ease: "easeIn" },
              }}
              className="flex flex-col w-full text-center"
            >
              <div className="flex justify-center items-center bg-[#f4ece3] mx-auto mb-sm rounded-full w-12 h-12">
                <MdPerson size={24} className="text-[#6d4c41]" />
              </div>
              <h2
                className="mb-xs font-bold text-headline-md text-primary"
                style={{ color: "var(--color-primary, #b64b16)" }}
              >
                Tell us about yourself
              </h2>
              <p className="mb-md text-body-md text-on-surface-variant">
                So we can reach you when your results and MΛSTISHK are ready.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
                className="flex flex-col gap-md text-left"
              >
                {/* Name Field */}
                <div className="group">
                  <label
                    htmlFor="participant-name"
                    className="block mb-xs font-bold text-label-md text-on-surface-variant"
                  >
                    Full Name <span className="text-error">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <MdPerson
                      size={20}
                      className="left-4 absolute text-outline group-focus-within:text-primary pointer-events-none transition-colors"
                    />
                    <input
                      id="participant-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="bg-[#fcfaf8] py-3 pr-4 pl-12 border-[#f4ece3] border-2 hover:border-outline focus:border-primary rounded-xl w-full text-body-md text-on-surface placeholder:text-outline/60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <label className="block mb-sm font-bold text-label-md text-on-surface-variant">
                    Preferred Contact Method{" "}
                    <span className="text-error">*</span>
                  </label>
                  <div className="flex gap-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setContactMethod("email");
                        setContactValue("");
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-md rounded-xl font-semibold text-sm transition-all duration-300 border-2
                      ${
                        contactMethod === "email"
                          ? "bg-primary/10 text-primary border-primary bloom-shadow-primary scale-[1.02]"
                          : "bg-[#fcfaf8] text-on-surface-variant border-[#f4ece3] hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.01]"
                      }`}
                    >
                      <MdEmail size={20} />
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setContactMethod("mobile");
                        setContactValue("");
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-md rounded-xl font-semibold text-sm transition-all duration-300 border-2
                      ${
                        contactMethod === "mobile"
                          ? "bg-primary/10 text-primary border-primary bloom-shadow-primary scale-[1.02]"
                          : "bg-[#fcfaf8] text-on-surface-variant border-[#f4ece3] hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.01]"
                      }`}
                    >
                      <MdPhone size={20} />
                      Mobile
                    </button>
                  </div>
                </div>

                {/* Conditional Contact Input */}
                {contactMethod && (
                  <div
                    className="group animate-fade-in-up"
                    style={{ animationDuration: "0.4s" }}
                  >
                    <label
                      htmlFor="contact-value"
                      className="block mb-xs font-bold text-label-md text-on-surface-variant"
                    >
                      {contactMethod === "email"
                        ? "Email Address"
                        : "Mobile Number"}{" "}
                      <span className="text-error">*</span>
                    </label>
                    <div>
                      {contactMethod === "email" ? (
                        <div className="relative flex items-center">
                          <MdEmail
                            size={20}
                            className="left-4 absolute text-outline group-focus-within:text-primary pointer-events-none transition-colors"
                          />
                          <input
                            id="contact-value"
                            type="email"
                            value={contactValue}
                            onChange={(e) => setContactValue(e.target.value)}
                            placeholder="you@example.com"
                            className="bg-[#fcfaf8] py-3 pr-4 pl-12 border-[#f4ece3] border-2 hover:border-outline focus:border-primary rounded-xl w-full text-body-md text-on-surface placeholder:text-outline/60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
                      ) : (
                        <>
                          <style>{`
                          .custom-phone-input {
                            display: flex;
                            align-items: stretch;
                            background: #fcfaf8;
                            border: 2px solid #f4ece3;
                            border-radius: 0.75rem;
                            overflow: hidden;
                            transition: all 0.3s;
                          }
                          .custom-phone-input:focus-within {
                            border-color: var(--color-primary, #b64b16);
                            box-shadow: 0 0 0 2px rgba(182, 75, 22, 0.2);
                          }
                          .custom-phone-input:hover {
                            border-color: #d7caca;
                          }
                          .custom-phone-input .PhoneInputInput {
                            flex: 1;
                            background: transparent;
                            border: none;
                            outline: none;
                            padding: 0.85rem 1rem;
                            font-size: 15px;
                            color: inherit;
                          }
                          .custom-phone-input .PhoneInputInput::placeholder {
                            color: #a0938b;
                          }
                        `}</style>
                          <PhoneInput
                            id="contact-value"
                            defaultCountry="IN"
                            value={contactValue}
                            onChange={setContactValue}
                            countrySelectComponent={CustomCountrySelect}
                            placeholder="Enter your mobile number"
                            className="w-full text-on-surface custom-phone-input"
                            limitMaxLength={true}
                          />
                        </>
                      )}
                      <div className="flex items-center gap-1.5 mt-2 px-1 text-on-surface-variant text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[#8c6b5d]"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                        <span className="text-[#8c6b5d]">
                          Your details are safe with us.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isPersonalInfoValid || isSubmitting}
                  className={`mt-6 w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full font-bold text-lg transition-all duration-300
                  ${
                    isPersonalInfoValid && !isSubmitting
                      ? "bg-primary text-white hover:scale-[1.02] hover:shadow-lg bloom-shadow-primary cursor-pointer"
                      : "bg-surface-container-high text-outline cursor-not-allowed"
                  }`}
                  style={
                    isPersonalInfoValid && !isSubmitting
                      ? { backgroundColor: "var(--color-primary, #b64b16)" }
                      : {}
                  }
                >
                  {isSubmitting ? (
                    <>
                      <span className="border-2 border-white/30 border-t-white rounded-full w-5 h-5 animate-spin"></span>
                      Starting...
                    </>
                  ) : (
                    <>
                      Continue <MdArrowForward size={20} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* Step 1..N: Questions */}
          {currentStep > 0 &&
            (() => {
              const currentQuestion = questions[currentStep - 1];
              if (!currentQuestion) return null;

              const categoryQuestions = questions.filter(
                (q) => q.category === currentQuestion.category,
              );
              const indexInCategory =
                categoryQuestions.findIndex(
                  (q) => q.id === currentQuestion.id,
                ) + 1;
              const IconComponent = iconMap[currentQuestion.icon];

              return (
                <motion.div
                  key={`step${currentStep}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                    transition: { duration: 0.25, ease: "easeIn" },
                  }}
                  className="flex flex-col w-full"
                >
                  {/* Header */}
                  <div className="relative flex justify-center items-center mb-4 w-full">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="top-0 left-0 absolute flex items-center gap-1 font-medium text-on-surface-variant text-sm hover:text-primary transition-colors"
                    >
                      <MdArrowBack size={18} /> Previous
                    </button>

                    <div className="flex flex-col items-center">
                      <div className="flex justify-center items-center bg-[#fcece4] mb-2 rounded-full w-12 h-12 text-[#b64b16]">
                        {IconComponent && <IconComponent size={28} />}
                      </div>
                      <h2 className="font-bold text-[#b64b16] text-lg">
                        {currentQuestion.category}
                      </h2>
                      <span className="mt-1 font-medium text-on-surface-variant text-xs">
                        Question {indexInCategory} of {categoryQuestions.length}
                      </span>
                      <div className="bg-[#f3d9cd] mt-2 rounded-full w-8 h-[2px]"></div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {submitError && (
                    <div className="flex items-center gap-3 bg-error-container mb-lg p-sm rounded-lg text-on-error-container animate-fade-in-up">
                      <MdErrorOutline
                        size={20}
                        className="flex-shrink-0 text-error"
                      />
                      <p className="flex-1 text-sm">{submitError}</p>
                    </div>
                  )}

                  {/* QuestionCard */}
                  <div className="flex flex-1 justify-center items-center mb-4 w-full">
                    <QuestionCard
                      key={currentQuestion.id}
                      text={currentQuestion.text}
                      answer={answers[currentQuestion.id]}
                      options={currentQuestion.options}
                      onAnswer={(ans) => {
                        handleAnswer(currentQuestion.id, ans);
                        // Auto-advance after a short delay
                        if (ans && currentStep < totalSteps - 1) {
                          setTimeout(() => {
                            setCurrentStep((prev) =>
                              prev < totalSteps - 1 ? prev + 1 : prev,
                            );
                          }, 400);
                        }
                      }}
                    />
                  </div>

                  {/* Submit Button (Only on last question) */}
                  {currentStep === totalSteps - 1 && (
                    <div className="flex flex-col items-center mt-4 mb-8">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || answeredCount < minRequired}
                        className={`py-3 px-10 rounded-full font-bold transition-all duration-300 flex items-center gap-2
                      ${
                        !isSubmitting && answeredCount >= minRequired
                          ? "bg-primary text-white hover:scale-105 hover:shadow-lg bloom-shadow-primary cursor-pointer"
                          : "bg-surface-container-high text-outline cursor-not-allowed"
                      }`}
                        style={
                          !isSubmitting && answeredCount >= minRequired
                            ? {
                                backgroundColor:
                                  "var(--color-primary, #b64b16)",
                              }
                            : {}
                        }
                      >
                        {isSubmitting ? (
                          <>
                            <span className="border-2 border-white/30 border-t-white rounded-full w-5 h-5 animate-spin"></span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit <MdSend size={20} />
                          </>
                        )}
                      </button>
                      {answeredCount < minRequired && (
                        <p className="mt-4 text-center text-error text-sm animate-fade-in-up">
                          Please answer at least {minRequired} questions to
                          submit.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Footer Quote */}
                  <div className="flex flex-col justify-end items-center mt-2 text-center">
                    <MdSpa size={24} className="mb-1 text-[#f3d9cd]" />
                    <p className="mx-auto max-w-xs font-medium text-on-surface-variant text-xs">
                      {currentQuestion.insight}
                    </p>
                  </div>
                </motion.div>
              );
            })()}
        </AnimatePresence>
      </div>
    </section>
  );
}
