"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Clock, FastForward, Timer } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GameSpeedControlProps {
  onSpeedChange: (speed: number) => void
  currentGame: "tetris" | "snake" | "pong"
}

export default function GameSpeedControl({ onSpeedChange, currentGame }: GameSpeedControlProps) {
  const [showControls, setShowControls] = useState(false)
  const [speedFactor, setSpeedFactor] = useState(1)

  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0]
    setSpeedFactor(newSpeed)
    onSpeedChange(newSpeed)
  }

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-black/70 backdrop-blur-sm border border-[#e9d5ff]/50 shadow-[0_0_10px_rgba(233,213,255,0.3)] hover:shadow-[0_0_15px_rgba(233,213,255,0.5)]"
              onClick={() => setShowControls(!showControls)}
            >
              <Timer className="h-5 w-5 text-[#e9d5ff]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Game Speed Control</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {showControls && (
        <div className="absolute bottom-12 right-0 w-48 rounded-lg bg-black/80 p-4 backdrop-blur-sm border border-[#e9d5ff]/30 shadow-[0_0_15px_rgba(233,213,255,0.3)]">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[#e9d5ff]">Game Speed</span>
            <span className="text-xs text-[#c084fc]">{speedFactor.toFixed(1)}x</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#a855f7]" />
            <Slider
              defaultValue={[1]}
              min={0.2}
              max={2}
              step={0.1}
              onValueChange={handleSpeedChange}
              className="w-full"
            />
            <FastForward className="h-4 w-4 text-[#a855f7]" />
          </div>

          <div className="mt-2 text-xs text-[#c084fc]/70">Adjust the speed of the {currentGame} game</div>
        </div>
      )}
    </div>
  )
}
