import { MdClose, MdCheckCircle, MdShare, MdContentCopy } from "react-icons/md";
import {
  Users,
  Clock,
  Heart,
  MessageCircleHeart,
  Sparkles,
  Loader2,
  Send,
} from "lucide-react";
import { useState, useEffect } from "react";
import { trackEvent } from "../../lib/analytics";
import supabase from "../../lib/supabase";

export default function ResultTeaser({
  name,
  contactMethod,
  contactValue,
  scoreResult,
  referralCode,
  alreadyWaitlisted,
  onDismiss,
}) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("idle"); // idle | sending | sent | error

  useEffect(() => {
    if (scoreResult) {
      trackEvent("Result Viewed", {
        overall_score: scoreResult.overall,
        dominant_dimension: scoreResult.dominantDimension,
        severity: scoreResult.severity,
      });
    }
  }, [scoreResult]);

  if (!scoreResult) return null;

  const { severity } = scoreResult;

  const handleCopyLink = async () => {
    const shareUrl = referralCode
      ? `${window.location.origin}?ref=${referralCode}`
      : window.location.origin;
    const shareText = `I just did Restora's 90-second focus check. Turns out my brain's been running on fumes. Try it: ${shareUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Restora: 90-Second Focus Check",
          text: shareText,
          url: shareUrl,
        });
        trackEvent("Result Shared", {
          method: "native_share",
          severity: severity,
        });
        return;
      }
      await navigator.clipboard.writeText(shareText);
      setLinkCopied(true);
      trackEvent("Result Shared", {
        method: "clipboard_copy",
        severity: severity,
      });
      setTimeout(() => setLinkCopied(false), 2500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setLinkCopied(true);
      trackEvent("Result Shared", {
        method: "fallback_copy",
        severity: severity,
      });
      setTimeout(() => setLinkCopied(false), 2500);
    }
  };

  const handleClose = () => {
    onDismiss?.();
  };

  const handleOpenFeedback = () => {
    setShowFeedback(true);
    trackEvent("Feedback Modal Opened", { severity });
  };

  const handleSubmitFeedback = async () => {
    const trimmed = feedback.trim();
    if (!trimmed || feedbackStatus === "sending") return;

    setFeedbackStatus("sending");
    trackEvent("Feedback Submitted", {
      severity,
      length: trimmed.length,
    });

    try {
      const { error } = await supabase.from("user_feedback").insert([
        {
          feedback: trimmed,
          session_token: localStorage.getItem("restora_session_token") || null,
          name: name || null,
          contact_value: contactValue || null,
        },
      ]);
      if (error) throw error;
      setFeedbackStatus("sent");
    } catch (err) {
      console.error("[ResultTeaser] feedback save failed:", err);
      setFeedbackStatus("error");
    }
  };

  const handlePeekRoadmap = () => {
    trackEvent("Clicked Whats Coming From Result", { severity });
    onDismiss?.();
    requestAnimationFrame(() => {
      document
        .getElementById("whats-coming")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
      <div className="relative flex flex-col gap-6 md:gap-8 bg-[#fffaf5] shadow-2xl p-6 md:p-10 rounded-[32px] w-full max-w-[420px] md:max-w-[850px] max-h-[90vh] text-center md:text-left animate-fade-in-up overflow-y-auto">
        <button
          onClick={handleClose}
          className="top-5 right-5 z-10 absolute text-[#8c6b5d] hover:text-primary transition-colors"
        >
          <MdClose size={24} />
        </button>

        <div className="flex flex-col justify-center items-center px-4 py-4 md:py-8 w-full text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 shadow-sm mb-6 px-5 py-2 border border-green-300 rounded-full font-bold text-base text-green-800 animate-fade-in">
            <MdCheckCircle size={22} className="text-green-600" />
            {alreadyWaitlisted
              ? "Already on the waitlist"
              : "Waitlist spot confirmed"}
          </div>

          <h2 className="mb-4 font-bold text-[#92360b] text-3xl md:text-4xl">
            {alreadyWaitlisted
              ? "You're already on the list!"
              : "You're on the list!"}
          </h2>
          <p className="max-w-sm font-medium text-[#4a3f35] text-lg leading-relaxed">
            We&apos;ll hit you up the second Restora is ready. No spam energy.
            Promise.
          </p>
        </div>

        {/* Feedback + Roadmap CTAs */}
        <div className="flex sm:flex-row flex-col gap-3 px-1 w-full">
          <button
            type="button"
            onClick={handleOpenFeedback}
            disabled={feedbackStatus === "sent"}
            className="flex flex-1 justify-center items-center gap-2 bg-white hover:bg-[#fcece4] disabled:opacity-70 px-5 py-3.5 border-[#f3d9cd] border-2 hover:border-[#b64b16]/40 rounded-full font-bold text-[#92360b] text-[14px] md:text-[15px] transition-all"
          >
            {feedbackStatus === "sent" ? (
              <>
                <MdCheckCircle size={18} className="text-green-600" />
                Got your note. Thank you!
              </>
            ) : (
              <>
                <MessageCircleHeart size={18} />
                Thoughts? Spill
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePeekRoadmap}
            className="flex flex-1 justify-center items-center gap-2 bg-[#b64b16] hover:bg-[#92360b] shadow-lg shadow-orange-900/10 px-5 py-3.5 rounded-full font-bold text-[14px] text-white md:text-[15px] transition-colors"
          >
            <Sparkles size={18} />
            Peek at what&apos;s cooking
          </button>
        </div>

        {/* Bottom Share Section */}
        <div className="flex flex-col items-center bg-[#fffaf5] md:p-8 pt-6 border-[#f4ece3] md:border-2 border-t md:border-t-1 rounded-none md:rounded-[24px] w-full text-center">
          <div className="flex justify-center items-center gap-2.5 mb-4 text-[#92360b]">
            <Users size={24} />
            <h3 className="font-bold text-[12px] md:text-[13px] uppercase tracking-widest">
              Know someone running on empty?
            </h3>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex justify-center items-center gap-2 bg-[#b64b16] hover:bg-[#92360b] shadow-lg shadow-orange-900/10 mb-8 py-4 rounded-full w-full max-w-[320px] font-bold text-base text-white transition-colors"
          >
            {linkCopied ? (
              <>
                <MdCheckCircle size={20} />
                Link copied!
              </>
            ) : (
              <>
                {typeof navigator !== "undefined" && navigator.share ? (
                  <MdShare size={20} />
                ) : (
                  <MdContentCopy size={20} />
                )}
                Share with friends
              </>
            )}
          </button>

          <div className="flex sm:flex-row flex-col justify-center items-center sm:items-start gap-6 sm:gap-10 px-4 pt-6 border-[#f4ece3] border-t w-full">
            <div className="flex items-center sm:items-start gap-3 max-w-[180px] text-left">
              <Clock
                size={22}
                className="flex-shrink-0 mt-0.5 text-[#b64b16]"
              />
              <p className="text-[#8c6b5d] text-[12px] leading-relaxed">
                Takes just
                <br />
                <strong className="text-[#4a3f35]">90 seconds</strong>
              </p>
            </div>
            <div className="sm:block hidden bg-[#f4ece3] w-[1px] h-10" />
            <div className="flex items-center sm:items-start gap-3 max-w-[200px] text-left">
              <Heart
                size={22}
                className="flex-shrink-0 mt-0.5 text-[#b64b16]"
              />
              <p className="text-[#8c6b5d] text-[12px] leading-relaxed">
                You&apos;re helping them
                <br />
                <strong className="text-[#4a3f35]">
                  feel like themselves again
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback modal */}
      {showFeedback && (
        <div
          className="z-[60] fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => feedbackStatus !== "sending" && setShowFeedback(false)}
        >
          <div
            className="relative bg-[#fffaf5] shadow-2xl p-6 md:p-8 rounded-[28px] w-full max-w-[440px] animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowFeedback(false)}
              disabled={feedbackStatus === "sending"}
              className="top-4 right-4 absolute text-[#8c6b5d] hover:text-primary transition-colors"
            >
              <MdClose size={22} />
            </button>

            {feedbackStatus === "sent" ? (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="flex justify-center items-center bg-green-100 mb-4 rounded-full w-14 h-14">
                  <MdCheckCircle size={28} className="text-green-600" />
                </div>
                <h3 className="mb-2 font-bold text-[#92360b] text-xl">
                  Loud and clear
                </h3>
                <p className="max-w-xs text-[#4a3f35] text-[15px] leading-relaxed">
                  Your note just landed with the team. Thanks for helping us
                  make Restora less mid.
                </p>
                <button
                  type="button"
                  onClick={() => setShowFeedback(false)}
                  className="bg-[#b64b16] hover:bg-[#92360b] mt-6 px-6 py-3 rounded-full font-bold text-sm text-white transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2 text-[#92360b]">
                  <MessageCircleHeart size={22} />
                  <h3 className="font-bold text-xl">Spill the tea</h3>
                </div>
                <p className="mb-5 text-[#8c6b5d] text-[14px] leading-relaxed">
                  Love it, hate it, missing something? We read every word.
                  Rants absolutely welcome.
                </p>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What's on your mind..."
                  rows={5}
                  maxLength={2000}
                  disabled={feedbackStatus === "sending"}
                  className="bg-white mb-2 px-4 py-3 border-[#f3d9cd] border-2 focus:border-[#b64b16] rounded-2xl w-full text-[#4a3f35] text-[15px] placeholder:text-[#c4a99a] transition-colors outline-none resize-none"
                />
                <div className="flex justify-between items-center mb-5">
                  <span className="text-[#c4a99a] text-[12px]">
                    {feedback.length}/2000
                  </span>
                  {feedbackStatus === "error" && (
                    <span className="text-[12px] text-red-600">
                      Couldn&apos;t send. Try again?
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSubmitFeedback}
                  disabled={!feedback.trim() || feedbackStatus === "sending"}
                  className="flex justify-center items-center gap-2 bg-[#b64b16] hover:bg-[#92360b] disabled:opacity-50 shadow-lg shadow-orange-900/10 py-3.5 rounded-full w-full font-bold text-[15px] text-white transition-colors"
                >
                  {feedbackStatus === "sending" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send it
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
