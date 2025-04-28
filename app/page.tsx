"use client"

import { useState, useEffect } from "react"
import TetrisGame from "@/components/tetris-game"
import SnakeGame from "@/components/snake-game"
import PongGame from "@/components/pong-game"
import PortfolioContent from "@/components/portfolio-content"
import SourceCodeViewer from "@/components/source-code-viewer"
import GameSelector from "@/components/game-selector"
import GameSpeedControl from "@/components/game-speed-control"
import MusicPlayer from "@/components/music-player"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, RotateCcw } from "lucide-react"

export default function Home() {
  const [isMuted, setIsMuted] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [showPortfolio, setShowPortfolio] = useState(true)
  const [currentGame, setCurrentGame] = useState<"tetris" | "snake" | "pong">("tetris")
  const [gameSpeed, setGameSpeed] = useState(1)

  // Auto-start game after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameStarted(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Handle change
  const handleGameChange = (game: "tetris" | "snake" | "pong") => {
    setCurrentGame(game)
    // Ensure the game is started after swtiching
    if (!gameStarted) {
      setGameStarted(true)
    }
  }

  // game restart
  const handleRestartGame = () => {
    setGameStarted(false)
    setTimeout(() => setGameStarted(true), 100)
  }

  //  closing the game
  const handleCloseGame = () => {
    setCurrentGame("tetris")
  }

  // mute toggle
  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  //  game speed 
  const handleSpeedChange = (speed: number) => {
    setGameSpeed(speed)
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {/* Game background */}
      <div className="absolute inset-0 z-0">
        {currentGame === "tetris" && <TetrisGame isPlaying={gameStarted} isMuted={isMuted} speedFactor={gameSpeed} />}
        {currentGame === "snake" && (
          <SnakeGame isPlaying={gameStarted} onClose={handleCloseGame} speedFactor={gameSpeed} />
        )}
        {currentGame === "pong" && (
          <PongGame isPlaying={gameStarted} onClose={handleCloseGame} speedFactor={gameSpeed} />
        )}
      </div>

      {/*  content overlay */}
      {showPortfolio && (
        <div className="relative z-10 h-full w-full overflow-auto">
          <PortfolioContent />
        </div>
      )}

      {/* Music player */}
      <MusicPlayer isMuted={isMuted} onMuteToggle={handleMuteToggle} />

      {/* Game controls */}
      <div className="fixed bottom-4 right-4 z-20 flex flex-wrap gap-2 justify-end">
        <GameSelector currentGame={currentGame} onGameChange={handleGameChange} />
        <GameSpeedControl onSpeedChange={handleSpeedChange} currentGame={currentGame} />
        <SourceCodeViewer />
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-black/70 backdrop-blur-sm border border-[#c084fc]/50 shadow-[0_0_10px_rgba(192,132,252,0.3)] hover:shadow-[0_0_15px_rgba(192,132,252,0.5)]"
          onClick={() => setShowPortfolio(!showPortfolio)}
          title={showPortfolio ? "Hide Portfolio" : "Show Portfolio"}
        >
          {showPortfolio ? <EyeOff className="h-5 w-5 text-[#c084fc]" /> : <Eye className="h-5 w-5 text-[#c084fc]" />}
        </Button>
        <Button
          variant="outline"
          className="bg-black/70 backdrop-blur-sm border border-[#e9d5ff]/50 text-[#e9d5ff] shadow-[0_0_10px_rgba(233,213,255,0.3)] hover:shadow-[0_0_15px_rgba(233,213,255,0.5)]"
          onClick={() => setShowInstructions(!showInstructions)}
        >
          Game Controls
        </Button>
        {!gameStarted && (
          <Button
            variant="default"
            className="bg-gradient-to-r from-[#a855f7] to-[#c084fc] border-none text-white shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            onClick={() => setGameStarted(true)}
          >
            Start Game
          </Button>
        )}
        {gameStarted && (
          <Button
            variant="outline"
            className="bg-black/70 backdrop-blur-sm border border-[#a855f7]/50 text-[#a855f7] shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            onClick={handleRestartGame}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart
          </Button>
        )}
      </div>

      {/*Short Game instructions */}
      {showInstructions && (
        <div className="fixed bottom-16 right-4 z-20 w-64 rounded-lg bg-black/80 p-4 text-white backdrop-blur-sm border border-[#a855f7]/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          <h3 className="mb-2 font-bold text-[#a855f7]">
            {currentGame.charAt(0).toUpperCase() + currentGame.slice(1)} Controls:
          </h3>

          {currentGame === "tetris" && (
            <ul className="space-y-1 text-sm">
              <li>← → : Move left/right</li>
              <li>↑ : Rotate piece</li>
              <li>↓ : Soft drop</li>
              <li>Space : Hard drop</li>
              <li>P : Pause game</li>
            </ul>
          )}

          {currentGame === "snake" && (
            <ul className="space-y-1 text-sm">
              <li>← → ↑ ↓ : Change direction</li>
            </ul>
          )}

          {currentGame === "pong" && (
            <ul className="space-y-1 text-sm">
              <li>↑ ↓ : Move paddle up/down</li>
            </ul>
          )}

          <div className="mt-2 text-xs text-[#c084fc]">
            <p>Mobile: Swipe or use on-screen controls</p>
          </div>
          <Button
            variant="link"
            className="mt-2 p-0 text-xs text-[#c084fc] hover:text-[#c084fc]/80"
            onClick={() => setShowInstructions(false)}
          >
            Close
          </Button>
        </div>
      )}

      {/* Current game indicator */}
      <div className="fixed top-4 right-4 z-20 rounded-lg bg-black/60 p-2 text-xs text-[#c084fc] backdrop-blur-sm">
        <p>
          Current Game:{" "}
          <span className="text-[#a855f7] font-bold">{currentGame.charAt(0).toUpperCase() + currentGame.slice(1)}</span>
        </p>
      </div>

      {/* Copyleft notice */}
      <div className="fixed bottom-4 left-4 z-20 text-xs text-[#a855f7]/70">
        <span className="inline-block transform scale-x-[-1] mr-1">©</span> Copyleft {new Date().getFullYear()} - All
        Wrongs Reserved
        <br />
        Games based on open-source code by{" "}
        <a
          href="https://gist.github.com/straker"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#c084fc] hover:underline"
        >
          straker
        </a>
      </div>
    </main>
  )
}
