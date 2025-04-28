"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import MobileControls from "@/components/mobile-controls"

// Tetris constants
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const EMPTY_CELL = 0
const BLOCK_SIZE = 30
const GAME_SPEED = 800
const SPEED_INCREMENT = 50
const MAX_SPEED = 100

// Tetromino shapes
const TETROMINOES = [
  // I
  {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "purple-100",
  },
  // J
  {
    shape: [
      [2, 0, 0],
      [2, 2, 2],
      [0, 0, 0],
    ],
    color: "purple-300",
  },
  // L
  {
    shape: [
      [0, 0, 3],
      [3, 3, 3],
      [0, 0, 0],
    ],
    color: "purple-500",
  },
  // O
  {
    shape: [
      [4, 4],
      [4, 4],
    ],
    color: "purple-700",
  },
  // S
  {
    shape: [
      [0, 5, 5],
      [5, 5, 0],
      [0, 0, 0],
    ],
    color: "purple-900",
  },
  // T
  {
    shape: [
      [0, 6, 0],
      [6, 6, 6],
      [0, 0, 0],
    ],
    color: "fuchsia-500",
  },
  // Z
  {
    shape: [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ],
    color: "violet-600",
  },
]

// Change the COLORS object to use different hues of purple
const COLORS = {
  0: "transparent",
  1: "#e9d5ff", // purple-200
  2: "#c084fc", // purple-400
  3: "#a855f7", // purple-500
  4: "#9333ea", // purple-600
  5: "#7e22ce", // purple-700
  6: "#d946ef", // fuchsia-500
  7: "#8b5cf6", // violet-500
}

interface TetrisGameProps {
  isPlaying: boolean
  isMuted: boolean
  speedFactor?: number
}

export default function TetrisGame({ isPlaying, isMuted, speedFactor = 1 }: TetrisGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [gameOver, setGameOver] = useState(false)
  const [paused, setPaused] = useState(false)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [gameSpeed, setGameSpeed] = useState(GAME_SPEED)
  const [isMobile, setIsMobile] = useState(false)
  const { toast } = useToast()

  // Game state refs to avoid dependency issues in useEffect
  const gameOverRef = useRef(gameOver)
  const pausedRef = useRef(paused)
  const isPlayingRef = useRef(isPlaying)
  const isMutedRef = useRef(isMuted)
  const scoreRef = useRef(score)
  const levelRef = useRef(level)
  const linesRef = useRef(lines)
  const gameSpeedRef = useRef(gameSpeed)
  const speedFactorRef = useRef(speedFactor)

  // Update speed factor ref when prop changes
  useEffect(() => {
    speedFactorRef.current = speedFactor
    setGameSpeed(Math.max(GAME_SPEED - (level - 1) * SPEED_INCREMENT, MAX_SPEED) / speedFactor)
  }, [speedFactor, level])

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

  // Update refs when state changes
  useEffect(() => {
    gameOverRef.current = gameOver
    pausedRef.current = paused
    isPlayingRef.current = isPlaying
    isMutedRef.current = isMuted
    scoreRef.current = score
    levelRef.current = level
    linesRef.current = lines
    gameSpeedRef.current = gameSpeed
  }, [gameOver, paused, isPlaying, isMuted, score, level, lines, gameSpeed])

  // Handle audio
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying && !paused && !isMuted) {
      audio.play().catch((error) => console.error("Audio play failed:", error))
    } else {
      audio.pause()
    }

    return () => {
      audio.pause()
    }
  }, [isPlaying, paused, isMuted])

  // Create a new game board
  const createBoard = useCallback(() => {
    return Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL))
  }, [])

  // Game state
  const [board, setBoard] = useState(() => createBoard())
  const [currentPiece, setCurrentPiece] = useState(() => getRandomPiece())
  const [nextPiece, setNextPiece] = useState(() => getRandomPiece())
  const [position, setPosition] = useState({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 })

  // Get a random tetromino
  function getRandomPiece() {
    const randomIndex = Math.floor(Math.random() * TETROMINOES.length)
    return TETROMINOES[randomIndex]
  }

  // Reset the game
  const resetGame = useCallback(() => {
    setBoard(createBoard())
    setCurrentPiece(getRandomPiece())
    setNextPiece(getRandomPiece())
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 })
    setGameOver(false)
    setPaused(false)
    setScore(0)
    setLevel(1)
    setLines(0)
    setGameSpeed(GAME_SPEED / speedFactorRef.current)
  }, [createBoard, speedFactorRef])

  // Check if the move is valid
  const isValidMove = useCallback(
    (piece, newPosition) => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x] !== EMPTY_CELL) {
            const newX = newPosition.x + x
            const newY = newPosition.y + y

            // Check boundaries
            if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
              return false
            }

            // Check collision with existing pieces
            if (newY >= 0 && board[newY][newX] !== EMPTY_CELL) {
              return false
            }
          }
        }
      }
      return true
    },
    [board],
  )

  // Rotate a piece
  const rotatePiece = useCallback((piece) => {
    const rotatedPiece = {
      ...piece,
      shape: piece.shape[0].map((_, index) => piece.shape.map((row) => row[index]).reverse()),
    }
    return rotatedPiece
  }, [])

  // Merge the current piece with the board
  const mergePieceWithBoard = useCallback(() => {
    const newBoard = [...board.map((row) => [...row])]

    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x] !== EMPTY_CELL) {
          const boardY = position.y + y
          const boardX = position.x + x

          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = currentPiece.shape[y][x]
          }
        }
      }
    }

    return newBoard
  }, [board, currentPiece, position])

  // Check for completed lines
  const checkLines = useCallback(
    (board) => {
      const newBoard = [...board]
      let linesCleared = 0

      for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (newBoard[y].every((cell) => cell !== EMPTY_CELL)) {
          // Remove the line
          newBoard.splice(y, 1)
          // Add a new empty line at the top
          newBoard.unshift(Array(BOARD_WIDTH).fill(EMPTY_CELL))
          linesCleared++
          y++ // Check the same row again
        }
      }

      if (linesCleared > 0) {
        // Update score based on lines cleared
        const newLines = linesRef.current + linesCleared
        const newLevel = Math.floor(newLines / 10) + 1
        const points = [0, 100, 300, 500, 800][linesCleared] * levelRef.current

        setLines(newLines)
        setScore(scoreRef.current + points)

        // Level up if needed
        if (newLevel > levelRef.current) {
          setLevel(newLevel)
          const newSpeed = Math.max(GAME_SPEED - (newLevel - 1) * SPEED_INCREMENT, MAX_SPEED) / speedFactorRef.current
          setGameSpeed(newSpeed)

          toast({
            title: "Level Up!",
            description: `You've reached level ${newLevel}!`,
            duration: 2000,
          })
        }
      }

      return newBoard
    },
    [toast],
  )

  // Move the current piece down
  const moveDown = useCallback(() => {
    if (gameOverRef.current || pausedRef.current || !isPlayingRef.current) return

    const newPosition = { ...position, y: position.y + 1 }

    if (isValidMove(currentPiece, newPosition)) {
      setPosition(newPosition)
    } else {
      // Can't move down anymore, place the piece
      const newBoard = mergePieceWithBoard()
      const boardWithClearedLines = checkLines(newBoard)
      setBoard(boardWithClearedLines)

      // Get next piece
      setCurrentPiece(nextPiece)
      setNextPiece(getRandomPiece())
      setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 })

      // Check if game over
      if (!isValidMove(nextPiece, { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 })) {
        setGameOver(true)
        toast({
          title: "Game Over!",
          description: `Final Score: ${scoreRef.current}`,
          duration: 3000,
        })
      }
    }
  }, [position, currentPiece, isValidMove, mergePieceWithBoard, checkLines, nextPiece, toast])

  // Move the current piece left
  const moveLeft = useCallback(() => {
    if (gameOverRef.current || pausedRef.current || !isPlayingRef.current) return

    const newPosition = { ...position, x: position.x - 1 }
    if (isValidMove(currentPiece, newPosition)) {
      setPosition(newPosition)
    }
  }, [position, currentPiece, isValidMove])

  // Move the current piece right
  const moveRight = useCallback(() => {
    if (gameOverRef.current || pausedRef.current || !isPlayingRef.current) return

    const newPosition = { ...position, x: position.x + 1 }
    if (isValidMove(currentPiece, newPosition)) {
      setPosition(newPosition)
    }
  }, [position, currentPiece, isValidMove])

  // Rotate the current piece
  const rotate = useCallback(() => {
    if (gameOverRef.current || pausedRef.current || !isPlayingRef.current) return

    const rotated = rotatePiece(currentPiece)
    if (isValidMove(rotated, position)) {
      setCurrentPiece(rotated)
    }
  }, [currentPiece, position, rotatePiece, isValidMove])

  // Hard drop the current piece
  const hardDrop = useCallback(() => {
    if (gameOverRef.current || pausedRef.current || !isPlayingRef.current) return

    let newY = position.y
    while (isValidMove(currentPiece, { ...position, y: newY + 1 })) {
      newY++
    }

    setPosition({ ...position, y: newY })
    moveDown() // Place the piece immediately
  }, [position, currentPiece, isValidMove, moveDown])

  // Toggle pause
  const togglePause = useCallback(() => {
    if (gameOverRef.current || !isPlayingRef.current) return
    setPaused(!pausedRef.current)
  }, [])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlayingRef.current) return

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          moveLeft()
          break
        case "ArrowRight":
          e.preventDefault()
          moveRight()
          break
        case "ArrowUp":
          e.preventDefault()
          rotate()
          break
        case "ArrowDown":
          e.preventDefault()
          moveDown()
          break
        case " ":
          e.preventDefault()
          hardDrop()
          break
        case "p":
        case "P":
          e.preventDefault()
          togglePause()
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [moveLeft, moveRight, moveDown, rotate, hardDrop, togglePause])

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver || paused) return

    const gameLoop = setInterval(() => {
      moveDown()
    }, gameSpeed)

    return () => {
      clearInterval(gameLoop)
    }
  }, [isPlaying, gameOver, paused, gameSpeed, moveDown])

  // Reset game when isPlaying changes
  useEffect(() => {
    if (isPlaying) {
      resetGame()
    }
  }, [isPlaying, resetGame])

  // Draw the game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Resize canvas to fill screen
    const resizeCanvas = () => {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      canvas.width = windowWidth
      canvas.height = windowHeight

      // Calculate block size based on screen size
      const blockSize = Math.min(
        Math.floor(windowWidth / (BOARD_WIDTH + 6)), // Add some padding for mobile
        Math.floor(windowHeight / (BOARD_HEIGHT + 4)),
      )

      // Center the board
      const boardWidthPx = BOARD_WIDTH * blockSize
      const boardHeightPx = BOARD_HEIGHT * blockSize
      const offsetX = (windowWidth - boardWidthPx) / 2
      const offsetY = (windowHeight - boardHeightPx) / 2

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background - make it black with a subtle grid pattern
      ctx.fillStyle = "rgba(0, 0, 0, 1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw subtle grid lines for cyberpunk effect
      ctx.strokeStyle = "rgba(128, 0, 255, 0.15)"
      ctx.lineWidth = 1
      for (let i = 0; i < canvas.width; i += blockSize) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += blockSize) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }

      // Draw board border with cyberpunk glow
      ctx.strokeStyle = "rgba(128, 0, 255, 0.8)"
      ctx.lineWidth = 3
      ctx.shadowColor = "#8b5cf6"
      ctx.shadowBlur = 15
      ctx.strokeRect(offsetX - 2, offsetY - 2, boardWidthPx + 4, boardHeightPx + 4)
      ctx.shadowBlur = 0

      // Draw board
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          const cellValue = board[y][x]

          // Draw cell
          if (cellValue !== EMPTY_CELL) {
            ctx.fillStyle = COLORS[cellValue]
            ctx.shadowColor = COLORS[cellValue]
            ctx.shadowBlur = 10
            ctx.fillRect(offsetX + x * blockSize, offsetY + y * blockSize, blockSize, blockSize)

            // Add inner glow effect
            ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"
            ctx.lineWidth = 1
            ctx.strokeRect(offsetX + x * blockSize + 2, offsetY + y * blockSize + 2, blockSize - 4, blockSize - 4)
            ctx.shadowBlur = 0
          }
        }
      }

      // Draw current piece with glow effect
      if (!gameOver && currentPiece) {
        for (let y = 0; y < currentPiece.shape.length; y++) {
          for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x] !== EMPTY_CELL) {
              const pieceX = position.x + x
              const pieceY = position.y + y

              if (pieceY >= 0) {
                ctx.fillStyle = COLORS[currentPiece.shape[y][x]]
                ctx.shadowColor = COLORS[currentPiece.shape[y][x]]
                ctx.shadowBlur = 15
                ctx.fillRect(offsetX + pieceX * blockSize, offsetY + pieceY * blockSize, blockSize, blockSize)

                // Add inner glow effect
                ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"
                ctx.lineWidth = 1
                ctx.strokeRect(
                  offsetX + pieceX * blockSize + 2,
                  offsetY + pieceY * blockSize + 2,
                  blockSize - 4,
                  blockSize - 4,
                )
                ctx.shadowBlur = 0
              }
            }
          }
        }
      }

      // Draw ghost piece with cyberpunk style
      if (!gameOver && !paused && currentPiece) {
        let ghostY = position.y
        while (isValidMove(currentPiece, { x: position.x, y: ghostY + 1 })) {
          ghostY++
        }

        for (let y = 0; y < currentPiece.shape.length; y++) {
          for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x] !== EMPTY_CELL) {
              const pieceX = position.x + x
              const pieceY = ghostY + y

              if (pieceY >= 0 && pieceY !== position.y + y) {
                const color = COLORS[currentPiece.shape[y][x]]
                ctx.fillStyle = color.replace(")", ", 0.2)").replace("rgb", "rgba")
                ctx.strokeStyle = color.replace(")", ", 0.5)").replace("rgb", "rgba")
                ctx.lineWidth = 1
                ctx.fillRect(offsetX + pieceX * blockSize, offsetY + pieceY * blockSize, blockSize, blockSize)
                ctx.strokeRect(offsetX + pieceX * blockSize, offsetY + pieceY * blockSize, blockSize, blockSize)
              }
            }
          }
        }
      }

      // Draw next piece preview
      const nextPieceOffsetX = offsetX + boardWidthPx + 20
      const nextPieceOffsetY = offsetY + 50

      // Draw next piece label
      ctx.font = "bold 16px 'Orbitron', sans-serif"
      ctx.fillStyle = "#a855f7"
      ctx.textAlign = "center"
      ctx.shadowColor = "#a855f7"
      ctx.shadowBlur = 5
      ctx.fillText("NEXT", nextPieceOffsetX + blockSize * 2, nextPieceOffsetY - 20)
      ctx.shadowBlur = 0

      // Draw next piece box
      ctx.strokeStyle = "rgba(128, 0, 255, 0.5)"
      ctx.lineWidth = 2
      ctx.shadowColor = "#8b5cf6"
      ctx.shadowBlur = 10
      ctx.strokeRect(nextPieceOffsetX - 10, nextPieceOffsetY - 10, blockSize * 4 + 20, blockSize * 4 + 20)
      ctx.shadowBlur = 0

      // Draw next piece
      if (nextPiece) {
        for (let y = 0; y < nextPiece.shape.length; y++) {
          for (let x = 0; x < nextPiece.shape[y].length; x++) {
            if (nextPiece.shape[y][x] !== EMPTY_CELL) {
              ctx.fillStyle = COLORS[nextPiece.shape[y][x]]
              ctx.shadowColor = COLORS[nextPiece.shape[y][x]]
              ctx.shadowBlur = 10
              ctx.fillRect(nextPieceOffsetX + x * blockSize, nextPieceOffsetY + y * blockSize, blockSize, blockSize)

              // Add inner glow effect
              ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"
              ctx.lineWidth = 1
              ctx.strokeRect(
                nextPieceOffsetX + x * blockSize + 2,
                nextPieceOffsetY + y * blockSize + 2,
                blockSize - 4,
                blockSize - 4,
              )
              ctx.shadowBlur = 0
            }
          }
        }
      }

      // Draw game status with cyberpunk style
      if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.font = "bold 48px 'Orbitron', sans-serif"
        ctx.fillStyle = "#a855f7"
        ctx.textAlign = "center"
        ctx.shadowColor = "#a855f7"
        ctx.shadowBlur = 15
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 50)

        ctx.font = "24px 'Orbitron', sans-serif"
        ctx.fillStyle = "#c084fc"
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2)
        ctx.fillText(`Level: ${level}`, canvas.width / 2, canvas.height / 2 + 40)
        ctx.shadowBlur = 0
      } else if (paused) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.font = "bold 48px 'Orbitron', sans-serif"
        ctx.fillStyle = "#a855f7"
        ctx.textAlign = "center"
        ctx.shadowColor = "#a855f7"
        ctx.shadowBlur = 15
        ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2)
        ctx.shadowBlur = 0
      }

      // Draw score with cyberpunk style
      ctx.font = "bold 20px 'Orbitron', sans-serif"
      ctx.fillStyle = "#c084fc"
      ctx.textAlign = "left"
      ctx.shadowColor = "#c084fc"
      ctx.shadowBlur = 10
      ctx.fillText(`Score: ${score}`, 20, 30)
      ctx.fillText(`Level: ${level}`, 20, 60)
      ctx.fillText(`Lines: ${lines}`, 20, 90)
      ctx.fillText(`Speed: ${speedFactorRef.current.toFixed(1)}x`, 20, 120)
      ctx.shadowBlur = 0
    }

    // Initial resize
    resizeCanvas()

    // Resize on window resize
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [board, currentPiece, nextPiece, position, gameOver, paused, score, level, lines, isValidMove])

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" tabIndex={0} />
      <audio ref={audioRef} src="/audio/tetris-theme.mp3" loop preload="auto" className="hidden" />

      {/* Mobile controls */}
      {isMobile && isPlaying && !gameOver && !paused && (
        <MobileControls
          onMoveLeft={moveLeft}
          onMoveRight={moveRight}
          onMoveDown={moveDown}
          onRotate={rotate}
          onHardDrop={hardDrop}
        />
      )}
    </>
  )
}
