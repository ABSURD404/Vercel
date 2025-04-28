"use client"

import { Button } from "@/components/ui/button"
import { Gamepad2 } from "lucide-react"

interface GameSelectorProps {
  currentGame: "tetris" | "snake" | "pong"
  onGameChange: (game: "tetris" | "snake" | "pong") => void
}

export default function GameSelector({ currentGame, onGameChange }: GameSelectorProps) {
  const handleToggleGame = () => {
    if (currentGame === "tetris") {
      onGameChange("snake")
    } else if (currentGame === "snake") {
      onGameChange("pong")
    } else {
      onGameChange("tetris")
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10 rounded-full bg-black/70 backdrop-blur-sm border border-[#7e22ce]/50 shadow-[0_0_10px_rgba(126,34,206,0.3)] hover:shadow-[0_0_15px_rgba(126,34,206,0.5)]"
      title={`Current: ${currentGame.charAt(0).toUpperCase() + currentGame.slice(1)} - Click to change game`}
      onClick={handleToggleGame}
    >
      <Gamepad2 className="h-5 w-5 text-[#7e22ce]" />
    </Button>
  )
}
