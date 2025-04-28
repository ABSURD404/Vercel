"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw, ArrowUp, ArrowDown } from "lucide-react"

interface PongGameProps {
  isPlaying: boolean
  onClose: () => void
  speedFactor?: number
}

export default function PongGame({ isPlaying, onClose, speedFactor = 1 }: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [leftScore, setLeftScore] = useState(0)
  const [rightScore, setRightScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [touchY, setTouchY] = useState(0)

  // Game constants
  const GRID = 15
  const PADDLE_HEIGHT = GRID * 5 // 75
  const PADDLE_SPEED = 6
  const BALL_SPEED = 5
  const MAX_SCORE = 5

  // Game state refs
  const leftPaddle = useRef({
    x: GRID * 2,
    y: 0,
    width: GRID,
    height: PADDLE_HEIGHT,
    dy: 0,
  })

  const rightPaddle = useRef({
    x: 0,
    y: 0,
    width: GRID,
    height: PADDLE_HEIGHT,
    dy: 0,
  })

  const ball = useRef({
    x: 0,
    y: 0,
    width: GRID,
    height: GRID,
    resetting: false,
    dx: BALL_SPEED,
    dy: -BALL_SPEED,
  })

  const animationFrameId = useRef<number>(0)
  const speedFactorRef = useRef(speedFactor)

  // Update speed factor ref when prop changes
  useEffect(() => {
    speedFactorRef.current = speedFactor

    // Update ball speed based on speed factor
    if (!ball.current.resetting) {
      const direction = {
        x: ball.current.dx > 0 ? 1 : -1,
        y: ball.current.dy > 0 ? 1 : -1,
      }

      ball.current.dx = BALL_SPEED * speedFactor * direction.x
      ball.current.dy = BALL_SPEED * speedFactor * direction.y
    }
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

  // Collision detection
  const collides = useCallback((obj1: any, obj2: any) => {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    )
  }, [])

  // Reset game
  const resetGame = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current

    // Reset paddles
    leftPaddle.current = {
      x: GRID * 2,
      y: canvas.height / 2 - PADDLE_HEIGHT / 2,
      width: GRID,
      height: PADDLE_HEIGHT,
      dy: 0,
    }

    rightPaddle.current = {
      x: canvas.width - GRID * 3,
      y: canvas.height / 2 - PADDLE_HEIGHT / 2,
      width: GRID,
      height: PADDLE_HEIGHT,
      dy: 0,
    }

    // Reset ball
    ball.current = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      width: GRID,
      height: GRID,
      resetting: false,
      dx: BALL_SPEED * speedFactorRef.current,
      dy: -BALL_SPEED * speedFactorRef.current,
    }

    setLeftScore(0)
    setRightScore(0)
    setGameOver(false)
  }, [])

  // Game loop
  const gameLoop = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

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

    // Move paddles by their velocity
    leftPaddle.current.y += leftPaddle.current.dy
    rightPaddle.current.y += rightPaddle.current.dy

    // AI for left paddle (follows the ball)
    const leftPaddleCenter = leftPaddle.current.y + leftPaddle.current.height / 2
    if (ball.current.y < leftPaddleCenter - 10) {
      leftPaddle.current.dy = (-PADDLE_SPEED * speedFactorRef.current) / 1.5
    } else if (ball.current.y > leftPaddleCenter + 10) {
      leftPaddle.current.dy = (PADDLE_SPEED * speedFactorRef.current) / 1.5
    } else {
      leftPaddle.current.dy = 0
    }

    // Prevent paddles from going through walls
    const maxPaddleY = canvas.height - GRID - PADDLE_HEIGHT

    if (leftPaddle.current.y < GRID) {
      leftPaddle.current.y = GRID
    } else if (leftPaddle.current.y > maxPaddleY) {
      leftPaddle.current.y = maxPaddleY
    }

    if (rightPaddle.current.y < GRID) {
      rightPaddle.current.y = GRID
    } else if (rightPaddle.current.y > maxPaddleY) {
      rightPaddle.current.y = maxPaddleY
    }

  
    context.fillStyle = "#a855f7" 
    context.shadowColor = "#a855f7"
    context.shadowBlur = 10
    context.fillRect(leftPaddle.current.x, leftPaddle.current.y, leftPaddle.current.width, leftPaddle.current.height)
    context.shadowBlur = 0

    context.fillStyle = "#00ff9f" 
    context.shadowColor = "#00ff9f"
    context.shadowBlur = 10
    context.fillRect(
      rightPaddle.current.x,
      rightPaddle.current.y,
      rightPaddle.current.width,
      rightPaddle.current.height,
    )
    context.shadowBlur = 0

    // Move ball by its velocity
    ball.current.x += ball.current.dx
    ball.current.y += ball.current.dy

    // Prevent ball from going through walls by changing its velocity
    if (ball.current.y < GRID) {
      ball.current.y = GRID
      ball.current.dy *= -1
    } else if (ball.current.y + GRID > canvas.height - GRID) {
      ball.current.y = canvas.height - GRID * 2
      ball.current.dy *= -1
    }

    // Reset ball if it goes past paddle (but only if we haven't already done so)
    if ((ball.current.x < 0 || ball.current.x > canvas.width) && !ball.current.resetting) {
      ball.current.resetting = true

      // Update score
      if (ball.current.x < 0) {
        setRightScore((prev) => {
          const newScore = prev + 1
          if (newScore >= MAX_SCORE) {
            setGameOver(true)
          }
          return newScore
        })
      } else {
        setLeftScore((prev) => {
          const newScore = prev + 1
          if (newScore >= MAX_SCORE) {
            setGameOver(true)
          }
          return newScore
        })
      }

      // Give some time for the player to recover before launching the ball again
      setTimeout(() => {
        ball.current.resetting = false
        ball.current.x = canvas.width / 2
        ball.current.y = canvas.height / 2

        // Reset ball velocity with current speed factor
        ball.current.dx = BALL_SPEED * speedFactorRef.current * (Math.random() > 0.5 ? 1 : -1)
        ball.current.dy = BALL_SPEED * speedFactorRef.current * (Math.random() > 0.5 ? 1 : -1)
      }, 400 / speedFactorRef.current) // Adjust reset time based on speed factor
    }

    // Check to see if ball collides with paddle. If they do change x velocity
    if (collides(ball.current, leftPaddle.current)) {
      ball.current.dx *= -1

      // Move ball next to the paddle otherwise the collision will happen again
      ball.current.x = leftPaddle.current.x + leftPaddle.current.width
    } else if (collides(ball.current, rightPaddle.current)) {
      ball.current.dx *= -1

      // Move ball next to the paddle otherwise the collision will happen again
      ball.current.x = rightPaddle.current.x - ball.current.width
    }

    // Draw ball with glow effect
    context.fillStyle = "#c084fc" // Light purple
    context.shadowColor = "#c084fc"
    context.shadowBlur = 15
    context.fillRect(ball.current.x, ball.current.y, ball.current.width, ball.current.height)
    context.shadowBlur = 0

    // Draw walls with glow effect
    context.fillStyle = "#c084fc" // Light purple
    context.shadowColor = "#c084fc"
    context.shadowBlur = 5
    context.fillRect(0, 0, canvas.width, GRID)
    context.fillRect(0, canvas.height - GRID, canvas.width, GRID)
    context.shadowBlur = 0

    // Draw dotted line down the middle
    context.fillStyle = "#a855f7" // Purple
    context.shadowColor = "#a855f7"
    context.shadowBlur = 5
    for (let i = GRID; i < canvas.height - GRID; i += GRID * 2) {
      context.fillRect(canvas.width / 2 - GRID / 2, i, GRID, GRID)
    }
    context.shadowBlur = 0

    // Draw score
    context.font = "bold 32px 'Orbitron', sans-serif"
    context.textAlign = "center"

    context.fillStyle = "#a855f7" // Purple
    context.shadowColor = "#a855f7"
    context.shadowBlur = 10
    context.fillText(leftScore.toString(), canvas.width / 4, 50)
    context.shadowBlur = 0

    context.fillStyle = "#00ff9f" // Neon green
    context.shadowColor = "#00ff9f"
    context.shadowBlur = 10
    context.fillText(rightScore.toString(), (canvas.width / 4) * 3, 50)
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

      const winner = leftScore > rightScore ? "CPU" : "YOU"
      context.font = "24px 'Orbitron', sans-serif"
      context.fillStyle = "#c084fc"
      context.fillText(`${winner} WINS!`, canvas.width / 2, canvas.height / 2)
      context.shadowBlur = 0

      return
    }

    animationFrameId.current = requestAnimationFrame(gameLoop)
  }, [collides, leftScore, rightScore, gameOver])

  // Start/stop game
  useEffect(() => {
    if (isPlaying && canvasRef.current) {
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

      // Up arrow key
      if (e.key === "ArrowUp") {
        rightPaddle.current.dy = -PADDLE_SPEED * speedFactorRef.current
      }
      // Down arrow key
      else if (e.key === "ArrowDown") {
        rightPaddle.current.dy = PADDLE_SPEED * speedFactorRef.current
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!isPlaying) return

      // Up/down arrow keys
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        rightPaddle.current.dy = 0
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
    }
  }, [isPlaying])

  // Handle touch controls for mobile
  useEffect(() => {
    if (!isMobile || !canvasRef.current) return

    const canvas = canvasRef.current

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPlaying) return

      const touch = e.touches[0]
      const rect = canvas.getBoundingClientRect()
      const y = touch.clientY - rect.top

      setTouchY(y)

      // Move paddle to touch position
      const paddleCenter = rightPaddle.current.height / 2
      rightPaddle.current.y = Math.max(
        GRID,
        Math.min(canvas.height - GRID - rightPaddle.current.height, y - paddleCenter),
      )
    }

    canvas.addEventListener("touchmove", handleTouchMove)

    return () => {
      canvas.removeEventListener("touchmove", handleTouchMove)
    }
  }, [isMobile, isPlaying])

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return

      const canvas = canvasRef.current
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Update paddle positions after resize
      if (rightPaddle.current) {
        rightPaddle.current.x = canvas.width - GRID * 3
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

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
            <p className="mb-4 text-[#c084fc]">{leftScore > rightScore ? "CPU" : "YOU"} WINS!</p>
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
        <div className="fixed bottom-20 right-8 z-20 flex flex-col gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-16 w-16 rounded-full bg-black/70 backdrop-blur-sm border border-[#a855f7]/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
            onTouchStart={() => (rightPaddle.current.dy = -PADDLE_SPEED * speedFactorRef.current)}
            onTouchEnd={() => (rightPaddle.current.dy = 0)}
          >
            <ArrowUp className="h-8 w-8 text-[#a855f7]" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-16 w-16 rounded-full bg-black/70 backdrop-blur-sm border border-[#e9d5ff]/50 shadow-[0_0_10px_rgba(233,213,255,0.3)]"
            onTouchStart={() => (rightPaddle.current.dy = PADDLE_SPEED * speedFactorRef.current)}
            onTouchEnd={() => (rightPaddle.current.dy = 0)}
          >
            <ArrowDown className="h-8 w-8 text-[#e9d5ff]" />
          </Button>
        </div>
      )}
    </>
  )
}
