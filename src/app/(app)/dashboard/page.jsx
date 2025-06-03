"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { VoiceCallerModal } from "@/components/VoiceCallerModal"

export default function page() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-md rounded-xl bg-black/50 p-8 backdrop-blur-lg">
        <h1 className="mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-center text-4xl font-bold text-transparent">
          Premium Voice Caller
        </h1>
        <p className="mb-8 text-center text-gray-300">
          Experience crystal clear voice communication with our premium calling service
        </p>
        <Button
          onClick={() => setIsOpen(true)}
          className="mx-auto block w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-lg font-medium transition-all hover:from-violet-700 hover:to-indigo-700"
        >
          Open Voice Caller
        </Button>
      </div>
      <VoiceCallerModal open={isOpen} onOpenChange={setIsOpen} />
    </div>
  )
}