"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"

interface SnakeGameProps {
  isPlaying: boolean
  onClose: () => void
  speedFactor?: number
}

export default function SnakeGame({ isPlaying, onClose, speedFactor = 1 }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Game constants
  const GRID = 16
  const MAX_CELLS = useRef(4)
  const snake = useRef({
    x: 160,
    y: 160,
    dx: GRID,
    dy: 0,
    cells: [] as { x: number; y: number }[],
    maxCells: 4,
  })
  const apple = useRef({
    x: 320,
    y: 320,
  })
  const count = useRef(0)
  const animationFrameId = useRef<number>(0)
  const speedFactorRef = useRef(speedFactor)

  // Update speed factor ref when prop changes
  useEffect(() => {
    speedFactorRef.current = speedFactor
  }, [speedFactor])

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Get random position for apple
  const getRandomInt = useCallback((min: number, max: number) => {
    return Math.floor(Math.random() * (max - min)) + min
  }, [])

  // Reset game
  const resetGame = useCallback(() => {
    snake.current = {
      x: 160,
      y: 160,
      dx: GRID,
      dy: 0,
      cells: [],
      maxCells: 4,
    }
    apple.current = {
      x: getRandomInt(0, 25) * GRID,
      y: getRandomInt(0, 25) * GRID,
    }
    MAX_CELLS.current = 4
    setScore(0)
    setGameOver(false)
  }, [getRandomInt])

  // Game loop
  const gameLoop = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    // Adjust frame rate based on speed factor (higher speed = lower count threshold)
    const frameThreshold = Math.floor(4 / speedFactorRef.current)

    // Slow game loop to 15 fps instead of 60 (60/15 = 4)
    if (++count.current < frameThreshold) {
      animationFrameId.current = requestAnimationFrame(gameLoop)
      return
    }

    count.current = 0
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    context.fillStyle = "rgba(0, 0, 0, 1)"
    context.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines for cyberpunk effect
    context.strokeStyle = "rgba(128, 0, 255, 0.15)"
    context.lineWidth = 1
    for (let i = 0; i < canvas.width; i += GRID) {
      context.beginPath()
      context.moveTo(i, 0)
      context.lineTo(i, canvas.height)
      context.stroke()
    }
    for (let i = 0; i < canvas.height; i += GRID) {
      context.beginPath()
      context.moveTo(0, i)
      context.lineTo(canvas.width, i)
      context.stroke()
    }

    // Move snake by its velocity
    snake.current.x += snake.current.dx
    snake.current.y += snake.current.dy

    // Wrap snake position horizontally on edge of screen
    if (snake.current.x < 0) {
      snake.current.x = canvas.width - GRID
    } else if (snake.current.x >= canvas.width) {
      snake.current.x = 0
    }

    // Wrap snake position vertically on edge of screen
    if (snake.current.y < 0) {
      snake.current.y = canvas.height - GRID
    } else if (snake.current.y >= canvas.height) {
      snake.current.y = 0
    }

    // Keep track of where snake has been. Front of the array is always the head
    snake.current.cells.unshift({ x: snake.current.x, y: snake.current.y })

    // Remove cells as we move away from them
    if (snake.current.cells.length > snake.current.maxCells) {
      snake.current.cells.pop()
    }

    // Draw apple with glow effect
    context.fillStyle = "#a855f7" // Purple
    context.shadowColor = "#a855f7"
    context.shadowBlur = 10
    context.fillRect(apple.current.x, apple.current.y, GRID - 1, GRID - 1)
    context.shadowBlur = 0

    // Draw snake one cell at a time
    context.fillStyle = "#00ff9f" // Neon green
    snake.current.cells.forEach((cell, index) => {
      // Drawing 1 px smaller than the grid creates a grid effect
      context.shadowColor = "#00ff9f"
      context.shadowBlur = 5
      context.fillRect(cell.x, cell.y, GRID - 1, GRID - 1)
      context.shadowBlur = 0

      // Snake ate apple
      if (cell.x === apple.current.x && cell.y === apple.current.y) {
        snake.current.maxCells++
        MAX_CELLS.current++
        setScore(MAX_CELLS.current - 4) // Update score

        // Canvas is 400x400 which is 25x25 grids
        apple.current.x = getRandomInt(0, 25) * GRID
        apple.current.y = getRandomInt(0, 25) * GRID
      }

      // Check collision with all cells after this one (modified bubble sort)
      for (let i = index + 1; i < snake.current.cells.length; i++) {
        // Snake occupies same space as a body part. Reset game
        if (cell.x === snake.current.cells[i].x && cell.y === snake.current.cells[i].y) {
          setGameOver(true)
        }
      }
    })

    // Draw score
    context.font = "bold 20px 'Orbitron', sans-serif"
    context.fillStyle = "#c084fc"
    context.textAlign = "left"
    context.shadowColor = "#c084fc"
    context.shadowBlur = 10
    context.fillText(`Score: ${MAX_CELLS.current - 4}`, 20, 30)
    context.shadowBlur = 0

    // Draw game over
    if (gameOver) {
      context.fillStyle = "rgba(0, 0, 0, 0.8)"
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.font = "bold 48px 'Orbitron', sans-serif"
      context.fillStyle = "#a855f7"
      context.textAlign = "center"
      context.shadowColor = "#a855f7"
      context.shadowBlur = 15
      context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 50)

      context.font = "24px 'Orbitron', sans-serif"
      context.fillStyle = "#c084fc"
      context.fillText(`Score: ${MAX_CELLS.current - 4}`, canvas.width / 2, canvas.height / 2)
      context.shadowBlur = 0

      return
    }

    animationFrameId.current = requestAnimationFrame(gameLoop)
  }, [gameOver, getRandomInt])

  // Start/stop game
  useEffect(() => {
    if (isPlaying) {
      resetGame()
      animationFrameId.current = requestAnimationFrame(gameLoop)
    }

    return () => {
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [isPlaying, gameLoop, resetGame])

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return

      // Left arrow key
      if (e.key === "ArrowLeft" && snake.current.dx === 0) {
        snake.current.dx = -GRID
        snake.current.dy = 0
      }
      // Up arrow key
      else if (e.key === "ArrowUp" && snake.current.dy === 0) {
        snake.current.dy = -GRID
        snake.current.dx = 0
      }
      // Right arrow key
      else if (e.key === "ArrowRight" && snake.current.dx === 0) {
        snake.current.dx = GRID
        snake.current.dy = 0
      }
      // Down arrow key
      else if (e.key === "ArrowDown" && snake.current.dy === 0) {
        snake.current.dy = GRID
        snake.current.dx = 0
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isPlaying])

  // Handle direction changes
  const changeDirection = (dx: number, dy: number) => {
    if (
      (dx === -GRID && snake.current.dx !== GRID) ||
      (dx === GRID && snake.current.dx !== -GRID) ||
      (dy === -GRID && snake.current.dy !== GRID) ||
      (dy === GRID && snake.current.dy !== -GRID)
    ) {
      snake.current.dx = dx
      snake.current.dy = dy
    }
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        width={window.innerWidth}
        height={window.innerHeight}
        tabIndex={0}
      />

      {gameOver && (
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <div className="rounded-lg bg-black/80 p-6 backdrop-blur-md border border-[#a855f7]/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <h2 className="mb-4 text-2xl font-bold text-[#a855f7]">Game Over</h2>
            <p className="mb-4 text-[#c084fc]">Score: {MAX_CELLS.current - 4}</p>
            <Button
              variant="outline"
              className="bg-black/70 backdrop-blur-sm border border-[#a855f7]/50 text-[#a855f7] shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              onClick={resetGame}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart
            </Button>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="fixed bottom-20 left-1/2 z-20 grid -translate-x-1/2 transform grid-cols-3 gap-2">
          <div></div>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/70 backdrop-blur-sm border border-[#a855f7]/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
            onClick={() => changeDirection(0, -GRID)}
          >
            <ArrowUp className="h-6 w-6 text-[#a855f7]" />
          </Button>
          <div></div>

          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/70 backdrop-blur-sm border border-[#c084fc]/50 shadow-[0_0_10px_rgba(192,132,252,0.3)]"
            onClick={() => changeDirection(-GRID, 0)}
          >
            <ArrowLeft className="h-6 w-6 text-[#c084fc]" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/70 backdrop-blur-sm border border-[#e9d5ff]/50 shadow-[0_0_10px_rgba(233,213,255,0.3)]"
            onClick={() => changeDirection(0, GRID)}
          >
            <ArrowDown className="h-6 w-6 text-[#e9d5ff]" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/70 backdrop-blur-sm border border-[#c084fc]/50 shadow-[0_0_10px_rgba(192,132,252,0.3)]"
            onClick={() => changeDirection(GRID, 0)}
          >
            <ArrowRight className="h-6 w-6 text-[#c084fc]" />
          </Button>
        </div>
      )}
    </>
  )
}
