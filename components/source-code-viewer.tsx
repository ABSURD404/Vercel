"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Code } from "lucide-react"

export default function SourceCodeViewer() {
  const [activeTab, setActiveTab] = useState("game")

  const sourceCode = {
    game: `// Tetris Game Core Logic
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const EMPTY_CELL = 0

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
  // More shapes...
]

// Game functions
function createBoard() {
  return Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL))
}

function getRandomPiece() {
  const randomIndex = Math.floor(Math.random() * TETROMINOES.length)
  return TETROMINOES[randomIndex]
}

function isValidMove(piece, position, board) {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== EMPTY_CELL) {
        const newX = position.x + x
        const newY = position.y + y

        // Check boundaries and collisions
        if (
          newX < 0 || 
          newX >= BOARD_WIDTH || 
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && board[newY][newX] !== EMPTY_CELL)
        ) {
          return false
        }
      }
    }
  }
  return true
}

function rotatePiece(piece) {
  return {
    ...piece,
    shape: piece.shape[0].map((_, index) => 
      piece.shape.map((row) => row[index]).reverse()
    ),
  }
}

function checkLines(board) {
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

  return { newBoard, linesCleared }
}`,
    render: `// Canvas Rendering Logic
function drawGame(ctx, board, currentPiece, position) {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw background
  ctx.fillStyle = "rgba(0, 0, 0, 1)"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw grid lines
  ctx.strokeStyle = "rgba(128, 0, 255, 0.15)"
  ctx.lineWidth = 1
  for (let i = 0; i < canvas.width; i += blockSize) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, canvas.height)
    ctx.stroke()
  }
  
  // Draw board
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const cellValue = board[y][x]
      if (cellValue !== EMPTY_CELL) {
        // Draw cell with glow effect
        ctx.fillStyle = COLORS[cellValue]
        ctx.shadowColor = COLORS[cellValue]
        ctx.shadowBlur = 10
        ctx.fillRect(
          offsetX + x * blockSize, 
          offsetY + y * blockSize, 
          blockSize, 
          blockSize
        )
        
        // Inner highlight
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"
        ctx.lineWidth = 1
        ctx.strokeRect(
          offsetX + x * blockSize + 2, 
          offsetY + y * blockSize + 2, 
          blockSize - 4, 
          blockSize - 4
        )
        ctx.shadowBlur = 0
      }
    }
  }
  
  // Draw current piece
  if (currentPiece) {
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x] !== EMPTY_CELL) {
          const pieceX = position.x + x
          const pieceY = position.y + y
          
          if (pieceY >= 0) {
            // Similar drawing code for the current piece
            // with glow effects
          }
        }
      }
    }
  }
}`,
    controls: `// Game Controls
function handleKeyDown(e) {
  if (!isPlaying) return

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
  }
}

// Mobile touch controls
function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

function handleTouchMove(e) {
  touchEndX = e.touches[0].clientX
  touchEndY = e.touches[0].clientY
}

function handleTouchEnd() {
  const diffX = touchStartX - touchEndX
  const diffY = touchStartY - touchEndY
  
  // Detect swipe direction
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal swipe
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        moveLeft()
      } else {
        moveRight()
      }
    }
  } else {
    // Vertical swipe
    if (Math.abs(diffY) > 50) {
      if (diffY < 0) {
        hardDrop()
      } else {
        moveDown()
      }
    } else {
      // Short tap/swipe is a rotation
      if (Math.abs(diffY) < 20 && Math.abs(diffX) < 20) {
        rotate()
      }
    }
  }
}`,
    license: `/*
Tetris Portfolio - A cyberpunk-themed portfolio with playable Tetris
Copyright (C) ${new Date().getFullYear()} - Copyleft

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

Tetris Game based on: https://gist.github.com/straker/3c98304f8a6a9174efd8292800891ea1
Snake Game based on: https://gist.github.com/straker/ff00b4b49669ad3dec890306d348adc4
Pong Game based on: https://gist.github.com/straker/81b59eecf70da93af396f963596dfdc5

Music: "Tetris Theme (Korobeiniki) - String Quartet Arrangement"
License: CC0 / Public Domain
Source: Pixabay (https://pixabay.com/music/classical-string-quartet-tetris-theme-korobeiniki-rearranged-arr-for-strings-185592/)

This is a simplified educational version of the source code.
The complete source code is available at: https://github.com/yourusername/tetris-portfolio
*/`,
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-black/70 backdrop-blur-sm border border-[#9333ea]/50 shadow-[0_0_10px_rgba(147,51,234,0.3)] hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]"
          title="View Source Code"
        >
          <Code className="h-5 w-5 text-[#9333ea]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden bg-black/90 border border-[#a855f7]/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
        <DialogHeader>
          <DialogTitle className="text-[#a855f7] text-xl font-bold">Tetris Portfolio Source Code</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="game" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-4 bg-black/70 backdrop-blur-md border border-[#a855f7]/30 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
            <TabsTrigger value="game" className="data-[state=active]:bg-[#a855f7]/20 data-[state=active]:text-white">
              Game Logic
            </TabsTrigger>
            <TabsTrigger value="render" className="data-[state=active]:bg-[#a855f7]/20 data-[state=active]:text-white">
              Rendering
            </TabsTrigger>
            <TabsTrigger
              value="controls"
              className="data-[state=active]:bg-[#a855f7]/20 data-[state=active]:text-white"
            >
              Controls
            </TabsTrigger>
            <TabsTrigger value="license" className="data-[state=active]:bg-[#a855f7]/20 data-[state=active]:text-white">
              License
            </TabsTrigger>
          </TabsList>

          <div className="max-h-[60vh] overflow-auto rounded-md bg-black/50 p-4 border border-[#a855f7]/20">
            <TabsContent value="game">
              <pre className="text-sm text-[#e9d5ff] font-mono whitespace-pre-wrap">{sourceCode.game}</pre>
            </TabsContent>
            <TabsContent value="render">
              <pre className="text-sm text-[#e9d5ff] font-mono whitespace-pre-wrap">{sourceCode.render}</pre>
            </TabsContent>
            <TabsContent value="controls">
              <pre className="text-sm text-[#e9d5ff] font-mono whitespace-pre-wrap">{sourceCode.controls}</pre>
            </TabsContent>
            <TabsContent value="license">
              <pre className="text-sm text-[#e9d5ff] font-mono whitespace-pre-wrap">{sourceCode.license}</pre>
            </TabsContent>
          </div>
        </Tabs>
        <div className="mt-4 text-center text-xs text-[#c084fc]">
          <p>
            This is a simplified educational version of the source code.
            <br />
            The complete source code is available under the GNU General Public License v3.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
