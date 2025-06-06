"use client";
import { SignedIn, SignedOut, SignInButton, useClerk } from "@clerk/nextjs";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Link from "next/link";
import { VoiceCallerModal } from "@/components/VoiceCallerModal";

const VapiCallPage1 = dynamic(() => import("@/components/VoiceCallerModal"), {
  ssr: false,
});

const Page = () => {
  const [isVisible, setIsVisible] = useState({});
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [conversationModalOpen, setConversationModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { user } = useClerk();

  const leftColumnRef = useRef(null);
  const rightColumnRef = useRef(null);
  const benefitsRef = useRef(null);
  const signupRef = useRef(null);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Throttle scroll event for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll);
    return () => window.removeEventListener("scroll", throttledScroll);
  }, []);

  useEffect(() => {
    setIsVisible({ benefits: true });
    if (user) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setIsOpen(true);
    }
  }, [user]);

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Parallax background image */}
      <div
        className="fixed inset-0 w-full h-[140%]"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dfkn6xcg4/image/upload/v1748955951/ai-neural-profile_vtzufz.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          transform: `translateY(${scrollY * -0.1}px)`,
          willChange: "transform",
          zIndex: -2,
        }}
      />

      {/* Overlay */}
      <div
        className="fixed inset-0 w-full h-screen"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen px-0 lg:px-8">
        {/* Right Side - Signup Section (Appears first on mobile) */}
        <div className="order-1 lg:order-2 w-full lg:w-2/5 flex items-center justify-center py-8 lg:py-12 px-4 lg:px-6">
          <div
            className="signup-section signup-section-right"
            style={{
              maxWidth: "520px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* FREE emphasis banner */}
            <div className="bg-[#0A1F1A] text-[#22c55e] text-center py-3 border-[#22c55e] px-2 md:px-6 rounded-lg mb-6 font-bold text-xs md:text-sm uppercase tracking-wide animate-pulse">
              Your Personal Voice Analysis - 100% Free! It'll Change How You Use
              AI Forever.
            </div>

            <h3 className="text-white text-center text-xl sm:text-2xl px-2 font-bold mb-6 leading-tight">
              Create a Custom Voice Profile That Makes Every AI Tool Write
              Exactly Like You!
            </h3>

            {/* Value proposition */}
            <div className="backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20 hover:shadow-[0_0_35px_rgba(255,255,255,0.12),0_0_70px_rgba(0,255,200,0.08)] transition-all duration-300">
              <p className="text-center text-white font-bold text-sm md:text-lg mb-4 uppercase tracking-wide">
                Experience the future of AI:
              </p>
              <div className="space-y-4 -mx-4 lg:mx-0">
                {/* Section 1: Talk naturally */}
                <div className="text-white">
                  <p className="font-semibold mb-1 text-sm">
                    🗣️ Just talk naturally - no forms or quizzes
                  </p>
                  <p className="text-gray-300 text-sm ml-6">
                    Share your thoughts while AI listens and learns
                  </p>
                </div>

                {/* Section 2: AI magic */}
                <div className="text-white">
                  <p className="font-semibold mb-1 text-sm">
                    🤖 Watch AI work its magic
                  </p>
                  <p className="text-gray-300 text-sm ml-6">
                    Real-time analysis of your communication style
                  </p>
                </div>

                {/* Section 3: Instant blueprint */}
                <div className="text-white">
                  <p className="font-semibold mb-2 text-sm">
                    📧 Your blueprint arrives instantly
                  </p>
                  <ul className="text-gray-300 text-sm ml-6 space-y-1">
                    <li>→ Use in ChatGPT, Claude, Perplexity</li>
                    <li>→ Create emails, posts, and content</li>
                    <li>→ Everything sounds authentically YOU</li>
                  </ul>
                </div>

                {/* Section 4: Free offer */}
                <div className="text-white">
                  <p className="font-semibold text-[12px] md:text-[12px]">
                    🎁 Free conversation available NOW{" "}
                    <span className="text-yellow-400">(usually $97)</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center py-2">
              <SignedOut>
                <button className="text-md sm:text-md px-3 md:px-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 sm:py-4  rounded-xl transition-all duration-300 transform cursor-pointer hover:shadow-lg mb-6">
                  <SignInButton mode="modal">
                    SIGN IN TO UNLOCK YOUR VOICE
                  </SignInButton>
                </button>
              </SignedOut>

              <SignedIn>
                <button
                  onClick={() => setIsOpen(true)}
                  className="text-md sm:text-lg -mt-3 animate-pulse transition-all cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-1 px-8 sm:px-10 rounded-full transform hover:scale-105 shadow-lg"
                >
                  🚀 START NOW
                </button>
              </SignedIn>
            </div>

            <p className="text-center text-white text-xs italic mb-4 ">
              Complete in under 5 minutes.
            </p>

            {/* Dynamic social proof */}
            <div className="text-center bg-[#211915] border-[1px] border-[#E08337] rounded-2xl px-3 py-2 mb-6">
              <div className="text-[#E08337] font-bold text-sm md:text-base">
                🔥 2,847 voice profiles created this week
              </div>
              <div className="text-[#E08337]">100% FREE!!!</div>
            </div>
          </div>
        </div>

        {/* Left Side - Content Section (Appears below on mobile) */}
        <div className="order-2 lg:order-1 w-full lg:w-3/5 flex flex-col justify-center py-8 lg:py-12 px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-white space-y-8">
            {/* Hero Section */}
            <div className="text-center mb-8 lg:mb-12">
              <h1
                className="font-bold my-class mb-6 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl leading-tight  lg:uppercase"
              >
                <span className="block">Get Your Voice Blueprint</span>
                <span className="block">in Less Than 5 Minutes</span>
              </h1>
              <p className="subheadline text-base sm:text-lg md:text-xl lg:text-2xl text-blue-400 leading-relaxed text-glow-blue text-center lg:text-start">
                Ditch the robotic replies. Our conversational AI voice agent
                turns ChatGPT, Claude, and any other LLM into your own personal
                writing assistant, sounding exactly like you.
              </p>
            </div>

            {/* Benefits list */}
            <div className="backdrop-blur-sm rounded-2xl">
              <ul ref={benefitsRef} id="benefits" className="space-y-6 w-full">
                {[
                  <>
                    <strong>
                      You'll get a detailed, personalized Voice Profile
                    </strong>{" "}
                    → A breakdown of your tone, phrasing, rhythm, values, and
                    personality - ready to plug into any AI system.
                  </>,
                  <>
                    <strong>
                      We'll show you how to train your own GPT or LLM
                    </strong>{" "}
                    → So your custom AI assistant can respond, write, and create
                    content like <i>you</i> - across emails, DMs, and more.
                  </>,
                  <>
                    <strong>
                      Create authentic, on-brand social posts at scale
                    </strong>{" "}
                    → No more second-guessing captions. You'll have a content
                    engine that sounds like you and works on autopilot.
                  </>,
                ].map((benefit, index) => (
                  <li
                    key={index}
                    className={`flex items-start space-x-4 text-gray-200 transition-all  hover:scale-105${
                      isVisible["benefits"]
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-10"
                    }`}
                    style={{
                      transitionDelay: isVisible["benefits"]
                        ? `${index * 100}ms`
                        : "0ms",
                    }}
                  >
                    <svg
                      className="w-6 h-6 text-green-400 flex-shrink-0 mt-1 transition-transform duration-300 hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm sm:text-base lg:text-lg leading-relaxed">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chat-style Testimonials Section */}
            <div
              className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10"
              style={{
                boxShadow:
                  "0 0 20px rgba(255, 255, 255, 0.1), 0 0 40px rgba(0, 255, 200, 0.08), 0 0 80px rgba(0, 255, 200, 0.04)",
              }}
            >
              <h3
                className="text-center text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 font-bold uppercase tracking-wider"
                style={{
                  background:
                    "linear-gradient(45deg, #ffffff, #00ff88, #00ffcc, #ffffff)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "gradient-shift 3s ease infinite",
                  filter: "drop-shadow(0 0 10px rgba(0, 255, 136, 0.13))",
                }}
              >
                Real conversations from real users
              </h3>

              <div className="space-y-6">
                {/* Testimonial 1 */}
                <div className="flex items-start space-x-4 animate-fadeInUp">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    ER
                  </div>
                  <div className="flex-1 bg-white/10 rounded-2xl p-4 hover:shadow-[0_0_20px_rgba(0,255,200,0.2)] transition-all duration-300">
                    <div className="text-gray-200 text-sm sm:text-base leading-relaxed mb-3">
                      "The AI conversation felt so natural! It asked thoughtful
                      questions and really understood my writing style."
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-300 flex items-center">
                        Emma Rodriguez
                        <svg
                          className="w-4 h-4 ml-2 text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="text-gray-300 text-xs">2 hours ago</span>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="flex items-start space-x-4 animate-fadeInUp">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    MC
                  </div>
                  <div className="flex-1 bg-white/10 rounded-2xl p-4 hover:shadow-[0_0_20px_rgba(0,255,200,0.2)] transition-all duration-300">
                    <div className="text-gray-200 text-sm sm:text-base leading-relaxed mb-3">
                      "I was skeptical, but after 5 minutes chatting with the
                      AI, I had a blueprint that actually sounds like me!"
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-300 flex items-center">
                        Marcus Chen
                        <svg
                          className="w-4 h-4 ml-2 text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="text-gray-300 text-xs">5 hours ago</span>
                    </div>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className="flex items-start space-x-4 animate-fadeInUp">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    LP
                  </div>
                  <div className="flex-1 bg-white/10 rounded-2xl p-4 hover:shadow-[0_0_20px_rgba(0,255,200,0.2)] transition-all duration-300">
                    <div className="text-gray-200 text-sm sm:text-base leading-relaxed mb-3">
                      "This is exactly what I needed! My ChatGPT responses went
                      from robotic to authentic overnight 🎯"
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-300 flex items-center">
                        Lisa Park
                        <svg
                          className="w-4 h-4 ml-2 text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="text-gray-300 text-xs">Yesterday</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md bg-black/50">
            <VoiceCallerModal open={isOpen} onOpenChange={setIsOpen} />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .text-glow-white-animated {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
            0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3);
        }

        .text-glow-blue {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.6),
            0 0 20px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Page;