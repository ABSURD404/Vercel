"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ChevronDown, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileControlsProps {
  onMoveLeft: () => void
  onMoveRight: () => void
  onMoveDown: () => void
  onRotate: () => void
  onHardDrop: () => void
}

export default function MobileControls({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
}: MobileControlsProps) {
  const [isMobile, setIsMobile] = useState(false)

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

  // Handle touch events for swipe gestures
  useEffect(() => {
    if (!isMobile) return

    let touchStartX = 0
    let touchStartY = 0
    let touchEndX = 0
    let touchEndY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX
      touchEndY = e.touches[0].clientY
    }

    const handleTouchEnd = () => {
      const diffX = touchStartX - touchEndX
      const diffY = touchStartY - touchEndY

      // Detect swipe direction
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (Math.abs(diffX) > 50) {
          // Minimum swipe distance
          if (diffX > 0) {
            onMoveLeft()
          } else {
            onMoveRight()
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(diffY) > 50) {
          // Minimum swipe distance
          if (diffY < 0) {
            onHardDrop()
          } else {
            onMoveDown()
          }
        } else {
          // Short tap/swipe is a rotation
          if (Math.abs(diffY) < 20 && Math.abs(diffX) < 20) {
            onRotate()
          }
        }
      }
    }

    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isMobile, onMoveLeft, onMoveRight, onMoveDown, onRotate, onHardDrop])

  if (!isMobile) return null

  return (
    <div className="fixed bottom-20 left-1/2 z-20 flex -translate-x-1/2 transform gap-4">
      <div className="flex flex-col items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full bg-black/70 backdrop-blur-sm border border-[#a855f7]/50 shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
          onTouchStart={onRotate}
        >
          <RotateCw className="h-6 w-6 text-[#a855f7]" />
        </Button>
        <span className="text-xs text-[#a855f7]/70">Rotate</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full bg-black/70 backdrop-blur-sm border border-[#c084fc]/50 shadow-[0_0_10px_rgba(192,132,252,0.3)] hover:shadow-[0_0_15px_rgba(192,132,252,0.5)]"
          onTouchStart={onMoveLeft}
        >
          <ChevronLeft className="h-6 w-6 text-[#c084fc]" />
        </Button>
        <span className="text-xs text-[#c084fc]/70">Left</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full bg-black/70 backdrop-blur-sm border border-[#e9d5ff]/50 shadow-[0_0_10px_rgba(233,213,255,0.3)] hover:shadow-[0_0_15px_rgba(233,213,255,0.5)]"
          onTouchStart={onMoveDown}
          onTouchEnd={() => {}}
        >
          <ChevronDown className="h-6 w-6 text-[#e9d5ff]" />
        </Button>
        <span className="text-xs text-[#e9d5ff]/70">Down</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full bg-black/70 backdrop-blur-sm border border-[#c084fc]/50 shadow-[0_0_10px_rgba(192,132,252,0.3)] hover:shadow-[0_0_15px_rgba(192,132,252,0.5)]"
          onTouchStart={onMoveRight}
        >
          <ChevronRight className="h-6 w-6 text-[#c084fc]" />
        </Button>
        <span className="text-xs text-[#c084fc]/70">Right</span>
      </div>
    </div>
  )
}
