"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, PhoneOff, Mic, MicOff, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import Vapi from '@vapi-ai/web';

export function VoiceCallerModal({ open, onOpenChange }) {
  const [status, setStatus] = useState("idle")
  const [isMuted, setIsMuted] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")

  const vapiRef = useRef(null);
  const callIdRef = useRef(null);
  const userRef = useRef(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [conversation, setConversation] = useState([]);

  const { user, isLoaded } = useUser();

  // Keep userRef updated when user is loaded
  useEffect(() => {
    if (isLoaded && user) {
      userRef.current = user;
      console.log('✅ Clerk user loaded:', user.fullName, user.emailAddresses?.[0]?.emailAddress);
    }
  }, [isLoaded, user]);

  // Vapi config
  const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
  const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
  const VAPI_API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY;

  console.log(VAPI_PUBLIC_KEY,VAPI_ASSISTANT_ID,VAPI_API_KEY);
  
  // Helper function to handle errors
  const handleError = (error, context = "") => {
    console.error(`Error in ${context}:`, error);
    setStatus("error");
    setErrorMessage(error.message || "An unexpected error occurred");
    setIsSessionActive(false);
    
    // Auto-reset to idle after 5 seconds
    setTimeout(() => {
      setStatus("idle");
      setErrorMessage("");
      setCallDuration(0);
    }, 5000);
  };

  // Vapi listeners
  useEffect(() => {
    try {
      if (!VAPI_PUBLIC_KEY) {
        throw new Error("VAPI_PUBLIC_KEY is not configured");
      }

      const vapiInstance = new Vapi(VAPI_PUBLIC_KEY);
      vapiRef.current = vapiInstance;

      vapiInstance.on('call-start', () => {
        setIsSessionActive(true);
        setStatus("active");
        setIsMuted(false); // Reset mute state when call starts
      });

      vapiInstance.on('call-end', async () => {
        setIsSessionActive(false);
        setStatus("ended");
        setIsMuted(false); // Reset mute state when call ends
        
        try {
          await fetchTranscriptAndSend();
        } catch (error) {
          handleError(error, "fetchTranscriptAndSend");
        }
        
        setConversation([]);
        callIdRef.current = null;
        
        // Auto-reset to idle after call ends
        setTimeout(() => {
          if (status !== "error") {
            setStatus("idle");
            setCallDuration(0);
          }
        }, 3000);
      });

      vapiInstance.on('volume-level', (volume) => {
        setVolumeLevel(volume);
      });

      vapiInstance.on('message', (message) => {
        if (message.type === 'transcript' && message.transcriptType === 'final') {
          setConversation((prev) => [...prev, { role: message.role, text: message.transcript }]);
        }
      });

      vapiInstance.on('error', (error) => {
        handleError(error, "Vapi");
      });

      return () => {
        try {
          vapiInstance.stop();
        } catch (error) {
          console.error('Error stopping Vapi instance:', error);
        }
      };
    } catch (error) {
      handleError(error, "Vapi initialization");
    }
  }, []);

  const startConversation = async () => {
    if (!vapiRef.current) {
      handleError(new Error("Vapi instance not initialized"), "startConversation");
      return;
    }

    if (!VAPI_ASSISTANT_ID) {
      handleError(new Error("VAPI_ASSISTANT_ID is not configured"), "startConversation");
      return;
    }

    try {
      setStatus("connecting");
      setErrorMessage("");
      
      setTimeout(() => {
        setCallDuration(0);
      }, 1500);

      const call = await vapiRef.current.start(VAPI_ASSISTANT_ID);
      
      if (call?.id) {
        callIdRef.current = call.id;
      } else {
        throw new Error("Failed to get call ID");
      }
      
      // Status will be set to "active" by the 'call-start' event
    } catch (error) {
      handleError(error, "startConversation");
    }
  };

  const stopConversation = async () => {
    if (!vapiRef.current) {
      handleError(new Error("Vapi instance not available"), "stopConversation");
      return;
    }

    try {
      await vapiRef.current.stop();
      // Status will be handled by the 'call-end' event
    } catch (error) {
      handleError(error, "stopConversation");
    }
  };

  const fetchTranscriptAndSend = async () => {
    const callId = callIdRef.current;
    if (!callId) {
      throw new Error('Call ID is not available');
    }

    console.log('⏳ Waiting 30 seconds before first transcript check...');
    setTimeout(() => {
      checkTranscript(callId);
    }, 30000);
  };

  const checkTranscript = async (callId) => {
    const currentUser = userRef.current;

    if (!currentUser) {
      console.warn('⚠️ Clerk user not available yet, skipping.');
      return;
    }

    if (!VAPI_API_KEY) {
      throw new Error("VAPI_API_KEY is not configured");
    }

    try {
      const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch call details: ${response.statusText}`);
      }

      const data = await response.json();
      const status = data.status;
      const transcript = data.transcript;

      console.log('📞 Call Status:', status);

      if (status === 'in-progress') {
        console.log('🔄 Call still in progress. Retrying in 30 seconds...');
        setTimeout(() => checkTranscript(callId), 30000);
        return;
      }

      if (!transcript) {
        console.warn('⚠️ Transcript is empty.');
        return;
      }

      const userEmail = currentUser.emailAddresses?.[0]?.emailAddress || 'unknown';
      const userName = currentUser.fullName || 'unknown';

      console.log('📤 Sending to webhook:', {
        userEmail,
        userName,
        callId,
        transcript,
      });

      const webhookResponse = await fetch('https://dumbodial.com/webhook/voice-analysis-recording', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callId,
          Transcript: transcript,
          userEmail,
          userName,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!webhookResponse.ok) {
        throw new Error(`Failed to send transcript to webhook: ${webhookResponse.statusText}`);
      } else {
        console.log('✅ Transcript sent successfully.');
      }
    } catch (error) {
      console.error('❌ Error during transcript fetch/send:', error);
      // Don't set error status here as it might interfere with call flow
      // Just log the error for debugging
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Toggle mute - actually mute/unmute the Vapi call
  const toggleMute = async () => {
    if (!vapiRef.current || !isSessionActive) {
      console.warn('Cannot toggle mute: Vapi instance not available or call not active');
      return;
    }

    try {
      if (isMuted) {
        // Unmute
        await vapiRef.current.setMuted(false);
        setIsMuted(false);
        console.log('🔊 Microphone unmuted');
      } else {
        // Mute
        await vapiRef.current.setMuted(true);
        setIsMuted(true);
        console.log('🔇 Microphone muted');
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
      // Don't change the mute state if the operation failed
      handleError(error, 'toggleMute');
    }
  }

  // Update call duration timer
  useEffect(() => {
    let interval = null
    if (status === "active") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [status])

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false)
    }
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, onOpenChange])

  // Reset error when modal closes
  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setErrorMessage("");
      setCallDuration(0);
      setIsMuted(false); // Reset mute state when modal closes
    }
  }, [open]);

  if (!open) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative mx-4 w-full max-w-lg rounded-lg bg-[#1a3a3f] p-0 shadow-2xl">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/20 p-2 text-white/70 transition-colors hover:bg-black/30 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative flex flex-col items-center rounded-lg p-6">
          {/* Status indicator with neon effect */}
          <div className="mb-6 w-full">
            <div className="relative mx-auto flex w-fit items-center rounded-full bg-black/40 px-4 py-2 backdrop-blur-md">
              <div
                className={cn(
                  "mr-2 h-3 w-3 rounded-full",
                  status === "idle" && "bg-gray-400",
                  status === "connecting" && "animate-pulse bg-yellow-400 shadow-[0_0_10px_2px_rgba(250,204,21,0.7)]",
                  status === "active" && "bg-green-400 shadow-[0_0_10px_2px_rgba(74,222,128,0.7)]",
                  status === "ended" && "bg-red-400 shadow-[0_0_10px_2px_rgba(248,113,113,0.7)]",
                  status === "error" && "bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.7)]",
                )}
              />
              <span className="text-sm font-medium text-white">
                {status === "idle" && "Ready to Talk"}
                {status === "connecting" && "Connecting..."}
                {status === "active" && `In Call • ${formatTime(callDuration)}`}
                {status === "ended" && "Call Ended"}
                {status === "error" && "Error"}
              </span>
            </div>
          </div>

          {/* Error message */}
          {status === "error" && errorMessage && (
            <div className="mb-4 w-full rounded-lg bg-red-900/20 border border-red-500/30 p-3">
              <div className="flex items-center gap-2 text-red-300">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Avatar */}
          <div className="mb-6 flex flex-col items-center">
            <div
              className={cn(
                "mb-4 rounded-full p-1",
                status === "active" && "animate-pulse bg-gradient-to-r from-violet-500 to-fuchsia-500",
                status === "error" && "bg-gradient-to-r from-red-500 to-rose-500",
              )}
            >
              <Avatar className="h-24 w-24 border-4 border-black bg-gradient-to-br from-indigo-600 to-purple-700">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback className="text-3xl font-bold text-white bg-black">E</AvatarFallback>
              </Avatar>
            </div>
            <h3 className="text-xl font-bold text-white">Echo</h3>
            {status === "active" && <p className="text-sm text-gray-300">Echo</p>}
          </div>

          {/* Call controls */}
          <div className="mt-4 flex w-full justify-center gap-6">
            {(status === "idle" || status === "error") && (
              <Button
                onClick={startConversation}
                disabled={isSessionActive}
                className="h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 p-0 shadow-lg shadow-emerald-700/30 transition-all hover:scale-105 hover:shadow-emerald-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex justify-center">
                  <Phone className="h-10 w-10" />
                </div>
              </Button>
            )}

            {(status === "connecting" || status === "active") && (
              <>
                <Button
                  onClick={toggleMute}
                  disabled={!isSessionActive}
                  variant="outline"
                  className={cn(
                    "h-16 w-16 rounded-full border-0 p-0 shadow-lg backdrop-blur-sm transition-all",
                    isMuted
                      ? "bg-red-800/70 text-red-300 hover:bg-red-700/70"
                      : "bg-gray-800/70 text-white hover:bg-gray-700/70",
                    !isSessionActive && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isMuted ? (
                    <div className="flex justify-center"><MicOff className="h-10 w-10" /></div>
                  ) : (
                    <div className="flex justify-center"><Mic className="h-10 w-10" /></div>
                  )}
                  <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
                </Button>
                <Button
                  onClick={stopConversation}
                  disabled={!isSessionActive}
                  className="h-16 w-16 rounded-full bg-gradient-to-r from-red-500 to-rose-600 p-0 shadow-lg shadow-rose-700/30 transition-all hover:scale-105 hover:shadow-rose-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex justify-center">
                    <PhoneOff className="h-10 w-10" />
                  </div>
                </Button>
              </>
            )}

            {status === "ended" && (
              <Button
                onClick={() => setStatus("idle")}
                className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-0 shadow-lg shadow-indigo-700/30 transition-all hover:scale-105 hover:shadow-indigo-700/50"
              >
                <div className="flex justify-center">
                  <Phone className="h-7 w-7" />
                  <span className="sr-only">New Call</span>
                </div>
              </Button>
            )}
          </div>

          {/* Premium design elements */}
          <div className="absolute bottom-0 left-0 right-0 top-0 -z-10 overflow-hidden rounded-lg">
            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl"></div>
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl"></div>
            <div className="absolute -bottom-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-fuchsia-600/20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}