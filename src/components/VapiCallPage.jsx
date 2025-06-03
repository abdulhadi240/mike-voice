'use client';
import React, { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';
import { useUser } from '@clerk/nextjs';

export default function VapiCallPage() {
  const vapiRef = useRef(null);
  const callIdRef = useRef(null);
  const userRef = useRef(null); // 🔥 New user ref to avoid stale closure
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [conversation, setConversation] = useState([]);

  const { user, isLoaded } = useUser();

  // 🧠 Keep userRef updated when user is loaded
  useEffect(() => {
    if (isLoaded && user) {
      userRef.current = user;
      console.log('✅ Clerk user loaded:', user.fullName, user.emailAddresses?.[0]?.emailAddress);
    }
  }, [isLoaded, user]);

  // Vapi config
  const VAPI_PUBLIC_KEY = ''
  const VAPI_ASSISTANT_ID = ''
  const VAPI_API_KEY = ''

  // Vapi listeners
  useEffect(() => {
    const vapiInstance = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapiInstance;

    vapiInstance.on('call-start', () => {
      setIsSessionActive(true);
    });

    vapiInstance.on('call-end', async () => {
      setIsSessionActive(false);
      await fetchTranscriptAndSend();
      setConversation([]);
      callIdRef.current = null;
    });

    vapiInstance.on('volume-level', (volume) => {
      setVolumeLevel(volume);
    });

    vapiInstance.on('message', (message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setConversation((prev) => [...prev, { role: message.role, text: message.transcript }]);
      }
    });

    vapiInstance.on('error', (e) => {
      console.error('Vapi error:', e);
    });

    return () => {
      vapiInstance.stop();
    };
  }, []);

  const startConversation = async () => {
    if (vapiRef.current) {
      try {
        const call = await vapiRef.current.start(VAPI_ASSISTANT_ID);
        if (call?.id) {
          callIdRef.current = call.id;
        }
      } catch (error) {
        console.error('Failed to start conversation:', error);
      }
    }
  };

  const stopConversation = async () => {
    if (vapiRef.current) {
      try {
        await vapiRef.current.stop();
      } catch (error) {
        console.error('Failed to stop conversation:', error);
      }
    }
  };

  const fetchTranscriptAndSend = async () => {
    const callId = callIdRef.current;
    if (!callId) {
      console.error('❌ Call ID is not available.');
      return;
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

    try {
      const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('❌ Failed to fetch call details:', response.statusText);
        return;
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

      const webhookResponse = await fetch('https://dumbodial.com/webhook/voice-analysis', {
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
        console.error('❌ Failed to send transcript to webhook:', webhookResponse.statusText);
      } else {
        console.log('✅ Transcript sent successfully.');
      }
    } catch (error) {
      console.error('❌ Error during transcript fetch/send:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10">
      <h1 className="text-2xl font-bold mb-4">🎙️ Voice Assistant</h1>

      {user && (
        <button
          onClick={startConversation}
          className="bg-green-500 text-white px-4 py-2 rounded mb-2 disabled:opacity-50"
          disabled={isSessionActive}
        >
          Start Talking
        </button>
      )}

      <button
        onClick={stopConversation}
        className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!isSessionActive}
      >
        End Conversation
      </button>

      {!isSessionActive && <p className="mt-4 text-gray-500">Loading assistant...</p>}
    </div>
  );
}
