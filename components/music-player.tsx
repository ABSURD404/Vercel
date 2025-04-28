"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, SkipBack, SkipForward, Play, Pause, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface MusicPlayerProps {
  isMuted: boolean
  onMuteToggle: () => void
}

export default function MusicPlayer({ isMuted, onMuteToggle }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Sample playlist - this can be expanded later
  const playlist = [
    {
      title: "Tetris Theme (Korobeiniki)",
      artist: "String Quartet Arrangement",
      src: "/audio/tetris-theme.mp3",
      license: "CC0 / Public Domain",
      year: "2021",
      genre: "Classical / Game Music",
      duration: "1:24",
      description:
        "A classical string quartet arrangement of the famous Tetris theme song, also known as Korobeiniki, a Russian folk song.",
    },
    // More tracks can be added here
  ]

  // Handle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((error) => console.error("Audio play failed:", error))
    }

    setIsPlaying(!isPlaying)
  }

  // Handle previous track
  const prevTrack = () => {
    const newIndex = (currentTrack - 1 + playlist.length) % playlist.length
    setCurrentTrack(newIndex)
  }

  // Handle next track
  const nextTrack = () => {
    const newIndex = (currentTrack + 1) % playlist.length
    setCurrentTrack(newIndex)
  }

  // Update audio element when track changes
  useEffect(() => {
    if (!audioRef.current) return

    audioRef.current.src = playlist[currentTrack].src

    if (isPlaying && !isMuted) {
      audioRef.current.play().catch((error) => console.error("Audio play failed:", error))
    }
  }, [currentTrack, isPlaying, isMuted, playlist])

  // Handle mute toggle
  useEffect(() => {
    if (!audioRef.current) return

    if (isMuted) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [isMuted])

  // Handle track end
  useEffect(() => {
    const handleTrackEnd = () => {
      nextTrack()
    }

    const audio = audioRef.current
    if (audio) {
      audio.addEventListener("ended", handleTrackEnd)
      return () => {
        audio.removeEventListener("ended", handleTrackEnd)
      }
    }
  }, []) // Intentionally omitting nextTrack from dependencies to avoid recreation

  const currentSong = playlist[currentTrack]

  return (
    <>
      <audio ref={audioRef} className="hidden" />

      <div className="fixed top-4 left-4 z-20 flex items-center gap-2">
        <div className="rounded-lg bg-black/60 p-2 backdrop-blur-sm border border-[#a855f7]/30 shadow-[0_0_10px_rgba(168,85,247,0.3)] flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#a855f7] hover:bg-[#a855f7]/20"
                  onClick={prevTrack}
                  disabled={isMuted}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Previous Track</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#c084fc] hover:bg-[#c084fc]/20"
                  onClick={togglePlay}
                  disabled={isMuted}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isPlaying ? "Pause" : "Play"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#a855f7] hover:bg-[#a855f7]/20"
                  onClick={nextTrack}
                  disabled={isMuted}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next Track</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#e9d5ff] hover:bg-[#e9d5ff]/20"
                  onClick={onMuteToggle}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMuted ? "Unmute" : "Mute"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#c084fc] hover:bg-[#c084fc]/20"
                      disabled={isMuted}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Track Info</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <PopoverContent className="w-80 bg-black/90 border border-[#a855f7]/30 shadow-[0_0_15px_rgba(168,85,247,0.3)] text-white">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#a855f7]">Track Information</h3>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-[#e9d5ff]/70 text-sm">Title:</div>
                  <div className="col-span-2 text-[#e9d5ff] text-sm">{currentSong.title}</div>

                  <div className="text-[#e9d5ff]/70 text-sm">Artist:</div>
                  <div className="col-span-2 text-[#e9d5ff] text-sm">{currentSong.artist}</div>

                  <div className="text-[#e9d5ff]/70 text-sm">License:</div>
                  <div className="col-span-2 text-[#e9d5ff] text-sm">{currentSong.license}</div>

                  <div className="text-[#e9d5ff]/70 text-sm">Year:</div>
                  <div className="col-span-2 text-[#e9d5ff] text-sm">{currentSong.year}</div>

                  <div className="text-[#e9d5ff]/70 text-sm">Genre:</div>
                  <div className="col-span-2 text-[#e9d5ff] text-sm">{currentSong.genre}</div>

                  <div className="text-[#e9d5ff]/70 text-sm">Duration:</div>
                  <div className="col-span-2 text-[#e9d5ff] text-sm">{currentSong.duration}</div>
                </div>

                <div className="pt-2">
                  <div className="text-[#e9d5ff]/70 text-sm">Description:</div>
                  <div className="text-[#e9d5ff] text-sm mt-1">{currentSong.description}</div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {!isMuted && isPlaying && (
          <div className="max-w-xs rounded-lg bg-black/60 p-2 text-xs text-[#c084fc] backdrop-blur-sm">
            <p>
              Now playing: {currentSong.title} - {currentSong.artist}
              <br />
              <span className="text-[#e9d5ff]/70">{currentSong.license}</span>
            </p>
          </div>
        )}
      </div>
    </>
  )
}
