"use client"

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Palette, Moon, Sun, HelpCircle, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Loader2 as Spinner } from "lucide-react"

const drumKits = {
  "Vibrant Kit": [
    { name: 'Kick', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kick-BC%20TM%20Kick%20Bombay-cy83EM8wSywJkjsfVudghEUir7VHZU.WAV', borderColor: 'border-red-400' },
    { name: 'Snare', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snare-BC%20TM%20Snare%20King-zOxUMJgQu6gBx8yb2JDvRdsbvSuWuM.WAV', borderColor: 'border-blue-400' },
    { name: 'Hi-Hat', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HiHat-BC%20TM%20HiHat%20TDK-iWvPQUUNRNs6BmIKtLS1j5Q2asXqvU.WAV', borderColor: 'border-green-400' },
    { name: 'Clap', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Clap-BC%20TM%20Clap%20Easy-2PiMGvfRhvROdPY3smK0Y48znWJocz.WAV', borderColor: 'border-yellow-400' },
    { name: 'Perc Coins', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Perc-BC%20TM%20Perc%20Coins-lbKEtywwsPHZpV1eThAXyjoskTS17p.WAV', borderColor: 'border-purple-400' },
    { name: 'Perc Bleep', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Perc-BC%20TM%20Perc%20Bleep-JdgcTOp2cThOYkYNnzUoq8sIG424ZB.WAV', borderColor: 'border-pink-400' },
    { name: 'Perc OG', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Perc-BC%20TM%20Perc%20OG-SkYFf6qJf9L9FFos7eNGUBNNV1PaxT.WAV', borderColor: 'border-indigo-400' },
    { name: 'Snare AC', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snare-BC%20TM%20Snare%20AC-qldlt0Z18hDtXQ617IersjV7gyYJ7J.WAV', borderColor: 'border-orange-400' },
    { name: 'Hi-Hat Wait', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HiHat-BC%20TM%20HiHat%20Wait-fuAFQRJnB2NSUkyTm9pZf0rQ3vT48A.WAV', borderColor: 'border-teal-400' },
  ],
  "Drift Kit": [
    { name: 'Intro', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Intro-ooQg6Uyc8qnhe4s6bfIe5InnzFyhbc.wav', borderColor: 'border-red-500' },
    { name: 'Melody', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Melody-7ECwiI9veRPUBYvtjFkY1aRb5UbQDf.wav', borderColor: 'border-blue-500' },
    { name: 'Bass', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bass-CJ7l1TocDJ8myv5RxAQC112vT6yXSt.wav', borderColor: 'border-green-500' },
    { name: 'DrumLoop', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DrumLoop-7uDeDmu9e0QY6aDsXIQxEyea636gOn.wav', borderColor: 'border-yellow-500' },
    { name: 'Kick', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kick-gbwN2JGvV8e1vQel81oNFW9JV7kIIq.wav', borderColor: 'border-purple-500' },
    { name: 'Snare', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snare-9jOlhzUblhSqFlklyKH6qhoG1UNhdb.wav', borderColor: 'border-pink-500' },
    { name: 'HatClosed', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HatClosed-3jzPly4TFMTSeyTmb04StbGH2dSQYp.wav', borderColor: 'border-indigo-500' },
    { name: 'HatOpen', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HatOpen-mTLwMaXTuTWWhAn8s1a0wOt27XiWyz.wav', borderColor: 'border-orange-500' },
    { name: 'FX', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FX-7R5gv1isFdYOs8AY8HahEgs6Gklqpr.wav', borderColor: 'border-teal-500' },
  ],
  "Techno Kit": [
    { name: 'Clap', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dtdk_clap_analog-ji9i5VTTdKWsPb4F4e7k0QO3HaMamQ.wav', borderColor: 'border-red-300' },
    { name: 'Hat Jackson', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dtdk_hat_jackson-jUbW1fREfSk5EDxZQMpPZDnFqmfN9q.wav', borderColor: 'border-blue-300' },
    { name: 'Hat Ice', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dtdk_hat_ice-hgw3XRE94viOfQPSOgVPLPr2HZu6NY.wav', borderColor: 'border-green-300' },
    { name: 'Perc Sangria', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dtdk_perc_sangria-psOGgT0xrrIuA9mhCVD8CJ2f8Rt5Gh.wav', borderColor: 'border-yellow-300' },
    { name: 'Kick End', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dtdk_kick_end-xYG736f86x003rPLXitXpVokHEAOme.wav', borderColor: 'border-purple-300' },
    { name: 'Snare Goose', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dtdk_snare_goose-SQu0XRXe16K7wtDxZGUuQHBEpYx0OF.wav', borderColor: 'border-pink-300' },
    { name: 'Hat Kit1', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dtdk_drum_120_kit1_hat-OBWAcuWrSltj566ZGwCsAp9ZWIGQph.wav', borderColor: 'border-indigo-300' },
    { name: 'Kick Kit1', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dtdk_drum_120_kit1_kick-QuvUPbDPyj12Zeihe41mMULnw3tCkf.wav', borderColor: 'border-orange-300' },
    { name: 'Perc Kit2', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dtdk_drum_120_kit2_perc-B37sWcjT3HrSikyqCnDoh5avX3pQLb.wav', borderColor: 'border-teal-300' },
  ],
  "-- empty kit --": [
    { name: 'Sample 1', url: '', borderColor: 'border-red-300' },
    { name: 'Sample 2', url: '', borderColor: 'border-blue-300' },
    { name: 'Sample 3', url: '', borderColor: 'border-green-300' },
    { name: 'Sample 4', url: '', borderColor: 'border-yellow-300' },
    { name: 'Sample 5', url: '', borderColor: 'border-purple-300' },
    { name: 'Sample 6', url: '', borderColor: 'border-pink-300' },
    { name: 'Sample 7', url: '', borderColor: 'border-indigo-300' },
    { name: 'Sample 8', url: '', borderColor: 'border-orange-300' },
    { name: 'Sample 9', url: '', borderColor: 'border-teal-300' },
  ],
}

const colorPalettes = {
  indigo: {
    light: {
      background: 'bg-[#F9F5EB]',
      drumPad: 'bg-[#E4DCCF]',
      select: 'bg-[#E8E8E8]',
      selectContent: 'bg-[#E4DCCF]',
      selectItem: 'focus:bg-[#EA5455]',
      text: 'text-[#002B5B]',
      selectText: 'text-[#002B5B]',
    },
    dark: {
      background: 'bg-[#222831]',
      drumPad: 'bg-[#393E46]',
      select: 'bg-[#00ADB5]',
      selectContent: 'bg-[#393E46]',
      selectItem: 'focus:bg-[#00ADB5]',
      text: 'text-[#E8E8E8]',
      selectText: 'text-[#E8E8E8]',
    },
  },
  teal: {
    light: {
      background: 'bg-[#EEF5FF]',
      drumPad: 'bg-[#B4D4FF]',
      select: 'bg-[#E8E8E8]',
      selectContent: 'bg-[#B4D4FF]',
      selectItem: 'focus:bg-[#86B6F6]',
      text: 'text-[#176B87]',
      selectText: 'text-[#176B87]',
    },
    dark: {
      background: 'bg-[#222831]',
      drumPad: 'bg-[#30475E]',
      select: 'bg-[#F05454]',
      selectContent: 'bg-[#30475E]',
      selectItem: 'focus:bg-[#F05454]',
      text: 'text-[#E8E8E8]',
      selectText: 'text-[#E8E8E8]',
    },
  },
  amber: {
    light: {
      background: 'bg-[#FFF5E4]',
      drumPad: 'bg-[#FFE3E1]',
      select: 'bg-[#E8E8E8]',
      selectContent: 'bg-[#FFE3E1]',
      selectItem: 'focus:bg-[#FFD1D1]',
      text: 'text-[#FF9494]',
      selectText: 'text-[#FF9494]',
    },
    dark: {
      background: 'bg-[#1B262C]',
      drumPad: 'bg-[#0F4C75]',
      select: 'bg-[#3282B8]',
      selectContent: 'bg-[#0F4C75]',
      selectItem: 'focus:bg-[#3282B8]',
      text: 'text-[#E8E8E8]',
      selectText: 'text-[#E8E8E8]',
    },
  },
  pink: {
    light: {
      background: 'bg-[#FFF5E4]',
      drumPad: 'bg-[#FFE3E1]',
      select: 'bg-[#E8E8E8]',
      selectContent: 'bg-[#FFE3E1]',
      selectItem: 'focus:bg-[#FF9494]',
      text: 'text-[#850000]',
      selectText: 'text-[#850000]',
    },
    dark: {
      background: 'bg-[#2C3333]',
      drumPad: 'bg-[#395B64]',
      select: 'bg-[#A5C9CA]',
      selectContent: 'bg-[#395B64]',
      selectItem: 'focus:bg-[#A5C9CA]',
      text: 'text-[#E8E8E8]',
      selectText: 'text-gray-800',
    },
  },
  purple: {
    light: {
      background: 'bg-[#E3DFFD]',
      drumPad: 'bg-[#ECF2FF]',
      select: 'bg-[#E8E8E8]',
      selectContent: 'bg-[#ECF2FF]',
      selectItem: 'focus:bg-[#E5D1FA]',
      text: 'text-[#3E54AC]',
      selectText: 'text-[#3E54AC]',
    },
    dark: {
      background: 'bg-[#352F44]',
      drumPad: 'bg-[#5C5470]',
      select: 'bg-[#B9B4C7]',
      selectContent: 'bg-[#5C5470]',
      selectItem: 'focus:bg-[#B9B4C7]',
      text: 'text-[#E8E8E8]',
      selectText: 'text-gray-800',
    },
  },
  green: {
    light: {
      background: 'bg-[#E3FCE9]',
      drumPad: 'bg-[#BEF0CB]',
      select: 'bg-[#E8E8E8]',
      selectContent: 'bg-[#BEF0CB]',
      selectItem: 'focus:bg-[#98E4FF]',
      text: 'text-[#445069]',
      selectText: 'text-[#445069]',
    },
    dark: {
      background: 'bg-[#1A1A2E]',
      drumPad: 'bg-[#16213E]',
      select: 'bg-[#0F3460]',
      selectContent: 'bg-[#16213E]',
      selectItem: 'focus:bg-[#0F3460]',
      text: 'text-[#E8E8E8]',
      selectText: 'text-[#E8E8E8]',
    },
  },
  orange: {
    light: {
      background: 'bg-[#FFF8E3]',
      drumPad: 'bg-[#FFEBB4]',
      select: 'bg-[#E8E8E8]',
      selectContent: 'bg-[#FFEBB4]',
      selectItem: 'focus:bg-[#FFC26F]',
      text: 'text-[#4F709C]',
      selectText: 'text-[#4F709C]',
    },
    dark: {
      background: 'bg-[#1F1D36]',
      drumPad: 'bg-[#3F3351]',
      select: 'bg-[#864879]',
      selectContent: 'bg-[#3F3351]',
      selectItem: 'focus:bg-[#864879]',
      text: 'text-[#E8E8E8]',
      selectText: 'text-[#E8E8E8]',
    },
  },
  blue: {
    light: {
      background: 'bg-[#EEF5FF]',
      drumPad: 'bg-[#B4D4FF]',
      select: 'bg-[#E8E8E8]',
      selectContent: 'bg-[#B4D4FF]',
      selectItem: 'focus:bg-[#86B6F6]',
      text:  'text-[#176B87]',
      selectText: 'text-[#176B87]',
    },
    dark: {
      background: 'bg-[#2C3639]',
      drumPad: 'bg-[#3F4E4F]',
      select: 'bg-[#A27B5C]',
      selectContent: 'bg-[#3F4E4F]',
      selectItem:  'focus:bg-[#A27B5C]',
      text: 'text-[#E8E8E8]',
      selectText: 'text-[#E8E8E8]',
    },
  },
}

type DrumPad = {
  id: number
  sound: {
    name: string
    url: string
    borderColor: string
  }
  isAvailable: boolean
}

const truncateFilename = (filename: string, maxLength: number) => {
  if (filename.length <= maxLength) return filename;
  const extension = filename.split('.').pop();
  const name = filename.substring(0, filename.length - extension!.length - 1);
  const mid = Math.ceil(maxLength / 2);
  return `${name.slice(0, mid - 2)}...${name.slice(-mid + 1)}.${extension}`;
};

const DrumPad = React.memo(({ pad, onPadTrigger, onShortPress, onLongPress, onDragEnter, onDragLeave, onDragOver, onDrop, isActive, isDraggedOver, fileInputRef, onFileInputChange, colorPalette }: {
  pad: DrumPad
  onPadTrigger: (e: React.MouseEvent | React.TouchEvent) => void
  onShortPress: () => void
  onLongPress: () => void
  onDragEnter: (e: React.DragEvent<HTMLButtonElement>) => void
  onDragLeave: (e: React.DragEvent<HTMLButtonElement>) => void
  onDragOver: (e: React.DragEvent<HTMLButtonElement>) => void
  onDrop: (e: React.DragEvent<HTMLButtonElement>) => void
  isActive: boolean
  isDraggedOver: boolean
  fileInputRef: React.RefObject<HTMLInputElement>
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  colorPalette: typeof colorPalettes[keyof typeof colorPalettes]['light' | 'dark']
}) => {
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const longPressDuration = 1000 // 1 second
  const isLongPress = useRef(false)
  const [pressPosition, setPressPosition] = useState({ x: 0, y: 0 });
  const padRef = useRef<HTMLButtonElement>(null);

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    isLongPress.current = false
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true
      onLongPress()
    }, longPressDuration)

    if (padRef.current) {
      const rect = padRef.current.getBoundingClientRect();
      
      let x, y;
      if (e.type === 'touchstart') {
        const touchEvent = e as React.TouchEvent;
        x =   touchEvent.touches[0].clientX;
        y = touchEvent.touches[0].clientY;
      } else {
        const mouseEvent = e as React.MouseEvent;
        x = mouseEvent.clientX;
        y = mouseEvent.clientY;
      }
      setPressPosition({
        x: ((x - rect.left) / rect.width) * 2 - 1,
        y: -((y - rect.top) / rect.height) * 2 + 1,
      });
    }
  }

  const handleInteractionEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
      if (!isLongPress.current) {
        if (pad.isAvailable) {
          onPadTrigger(e)
        } else {
          onShortPress()
        }
      }
    }
    isLongPress.current = false
    setPressPosition({ x: 0, y: 0 });
  }

  const truncatedName = truncateFilename(pad.sound.name, 12)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPressPosition({ x: 0, y: 0 });
    }, 100);

    return () => clearTimeout(timer);
  }, [pressPosition]);

  return (
    <div className="flex flex-col items-center">
      <div className="name-container mb-1 sm:mb-2 flex items-center">
        {!pad.isAvailable && <span className="unavailable-icon" aria-label="Sound unavailable"></span>}
        <div className={`name-content text-[8px] ${colorPalette.text}`} title={pad.sound.name}>
          {truncatedName}
        </div>
      </div>
      <button
        ref={padRef}
        className={`drum-pad w-full aspect-square ${colorPalette.drumPad}
          cursor-pointer transition-all duration-200  
          shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-opacity-50
          ${pad.sound.borderColor} border-2 rounded-lg p-4
          ${isActive ? 'opacity-75' : ''}
          ${isDraggedOver ? 'drag-over' : ''}`}
        style={{
          transform: `perspective(1000px) rotateX(${pressPosition.y * 10}deg) rotateY(${pressPosition.x * 10}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      />
      <input
        type="file"
        accept="audio/*"
        className="hidden"
        ref={fileInputRef}
        onChange={onFileInputChange}
      />
    </div>
  )
})

DrumPad.displayName = 'DrumPad'

type DrumKitName = keyof typeof drumKits;

export function DrumMachine() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentKit, setCurrentKit] = useState("Vibrant Kit")
  const [pads, setPads] = useState<DrumPad[]>([])
  const [activePad, setActivePad] = useState<number | null>(null)
  const [draggedOver, setDraggedOver] = useState<number | null>(null)
  const [currentPalette, setCurrentPalette] = useState<keyof typeof colorPalettes>('indigo')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isKitLoading, setIsKitLoading] = useState(false) // Added state for kit loading
  const fileInputRefs = useRef<(React.RefObject<HTMLInputElement>)[]>([])
  const audioContext = useRef<AudioContext | null>(null)
  const audioBuffers = useRef<{ [key: string]: AudioBuffer }>({})
  const activeAudioSources = useRef<{ [key: number]: AudioBufferSourceNode }>({})

  const initializeAudioContext = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }, [])

  const loadAudioBuffer = useCallback(async (url: string) => {
    if (!audioContext.current) return null
    
    if (audioBuffers.current[url]) {
      return audioBuffers.current[url]
    }

    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer)
      audioBuffers.current[url] = audioBuffer
      return audioBuffer
    } catch (error) {
      console.error('Error loading audio buffer:', error)
      return null
    }
  }, [])

  const checkSoundAvailability = useCallback(async (url: string) => {
    const buffer = await loadAudioBuffer(url)
    return buffer !== null
  }, [loadAudioBuffer])

  const initializePads = useCallback(async (kitName: DrumKitName) => {
    initializeAudioContext()
    const newPads = await Promise.all(
      drumKits[kitName].map(async (sound, index) => {
        const isAvailable = await checkSoundAvailability(sound.url)
        return { id: index, sound, isAvailable }
      })
    )
    
    setPads(newPads)
  }, [checkSoundAvailability, initializeAudioContext])

  useEffect(() => {
    const loadApp = async () => {
      if (pads.length === 0) {
        setIsLoading(true)
      }
      await initializePads(currentKit as "Vibrant Kit" | "Drift Kit" | "Techno Kit" | "-- empty kit --")
      setIsLoading(false)
      setIsKitLoading(false) // Added to set loading state to false after kit loads
    }
    loadApp()
  }, [currentKit, initializePads, pads.length])

  const playSound = useCallback((url: string, padId: number) => {
    if (!audioContext.current) return

    // Stop the currently playing sound for this pad
    if (activeAudioSources.current[padId]) {
      activeAudioSources.current[padId].stop()
      activeAudioSources.current[padId].disconnect()
    }

    const source = audioContext.current.createBufferSource()
    source.buffer = audioBuffers.current[url]
    source.connect(audioContext.current.destination)
    source.start(0)

    // Store the new audio source
    activeAudioSources.current[padId] = source

    // Remove the audio source when it finishes playing
    source.onended = () => {
      if (activeAudioSources.current[padId] === source) {
        delete activeAudioSources.current[padId]
      }
    }

    setActivePad(padId)
    setTimeout(() => setActivePad(null), 100)
  }, [])

  const handlePadTrigger = useCallback((e: React.MouseEvent | React.TouchEvent, padId: number) => {
    e.preventDefault()
    const pad = pads[padId]
    if (pad && pad.isAvailable) {
      playSound(pad.sound.url, padId)
    }
  }, [pads, playSound])

  const handleShortPress = useCallback((padId: number) => {
    const pad = pads[padId]
    if (pad && !pad.isAvailable) {
      fileInputRefs.current[padId]?.current?.click()
    }
  }, [pads])

  const handleLongPress = useCallback((padId: number) => {
    fileInputRefs.current[padId]?.current?.click()
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLButtonElement>, padId: number) => {
    e.preventDefault()
    setDraggedOver(padId)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setDraggedOver(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLButtonElement>, padId: number) => {
    e.preventDefault()
    setDraggedOver(null)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('audio/')) {
      await handleFileUpload(file, padId)
    }
  }, [])

  const handleFileUpload = useCallback(async (file: File, padId: number) => {
    const url = URL.createObjectURL(file)
    const isAvailable = await checkSoundAvailability(url)
    setPads((prevPads) =>
      prevPads.map((pad) =>
        pad.id === padId ? { ...pad, sound: { ...pad.sound, name: file.name, url }, isAvailable } : pad
      )
    )
  }, [checkSoundAvailability])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, padId: number) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      handleFileUpload(file, padId)
    }
  }, [handleFileUpload])

  const handleKitChange = useCallback((kitName: string) => {
    setIsKitLoading(true) // Updated to set loading state to true before kit change
    setCurrentKit(kitName)
  }, [])

  const handlePaletteChange = useCallback(() => {
    const palettes = Object.keys(colorPalettes) as (keyof typeof colorPalettes)[]
    const currentIndex = palettes.indexOf(currentPalette)
    const nextIndex = (currentIndex + 1) % palettes.length
    setCurrentPalette(palettes[nextIndex])
  }, [currentPalette])

  const handleThemeToggle = useCallback(() => {
    setIsDarkMode((prev) => !prev)
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const currentTheme = isDarkMode ? 'dark' : 'light'
  const currentColorPalette = colorPalettes[currentPalette][currentTheme]

  const drumPads = useMemo(() => (
    pads.map((pad) => {
      if (!fileInputRefs.current[pad.id]) {
        fileInputRefs.current[pad.id] = React.createRef<HTMLInputElement>();
      }
      return (
        <DrumPad
          key={pad.id}
          pad={pad}
          onPadTrigger={(e) => handlePadTrigger(e, pad.id)}
          onShortPress={() => handleShortPress(pad.id)}
          onLongPress={() => handleLongPress(pad.id)}
          onDragEnter={(e) => handleDragEnter(e, pad.id)}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, pad.id)}
          isActive={activePad === pad.id}
          isDraggedOver={draggedOver === pad.id}
          fileInputRef={fileInputRefs.current[pad.id]}
          onFileInputChange={(e) => handleFileInputChange(e, pad.id)}
          colorPalette={currentColorPalette}
        />
      )
    })
  ), [pads, handlePadTrigger, handleShortPress, handleLongPress, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleFileInputChange, activePad, draggedOver, currentColorPalette])

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center ml-[-30px] items-center">
        <style jsx global>{`
          .loader {
            width: 16px;
            height: 16px;
            box-shadow: 0 30px, 0 -30px;
            border-radius: 4px;
            background: currentColor;
            display: block;
            margin: -50px auto 0;
            position: relative;
            color: #B4D4FF;
            transform: translateY(30px);
            box-sizing: border-box;
            animation: animloader 2s ease infinite;
          }
          .loader::after,
          .loader::before {
            content: '';  
            box-sizing: border-box;
            width: 16px;
            height: 16px;
            box-shadow: 0 30px, 0 -30px;
            border-radius: 4px;
            background: currentColor;
            color: #B4D4F;
            position: absolute;
            left: 30px;
            top: 0;
            animation: animloader 20s 0.2s ease infinite;
          }
          .loader::before {
            animation-delay: 0.4s;
            left: 60px;
          }

          @keyframes animloader {
            0% {
              top: 0;
              color: #B4D4FF;
            }
            50% {
              color: #FFD1D1;
            }
            100% {
              top: 0;
              color: #B4D4FF;
            }
          }
              
      `}</style>
        <span className={`loader`}></span>
        
      </div>
    )
  }

  return (
    <div className={`w-full min-h-screen ${currentColorPalette.background} flex flex-col justify-start items-center relative overflow-hidden`}>
      <style jsx global>{`
        @import         url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        body {
          font-family: 'Press Start 2P', cursive;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        
                .loader {
                    width: 48px;
          height: 48px;
          border: 5px solid ${currentColorPalette.text};
          border-bottom-color: transparent;
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
        }

        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .name-container {
          width: 100%;
          height: 1.5rem;
          overflow: hidden;
          position: relative;
        }

        .name-content {
          position: absolute;
          white-space: nowrap;
        }

        .drum-pad {
          transition: all 0.1s ease;
          touch-action: manipulation;
          transform-style: preserve-3d;
        }

        .drum-pad:active {
          box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.1), -2px 2px 0 0 rgba(0, 0, 0, 0.05) !important;
        }

        .unavailable-icon {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin-right: 4px;
          color: #ff5252;
        }

        .unavailable-icon::before {
                    content: '×';
          font-size: 12px;
          line-height: 8px;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .drag-over {
          animation: pulse 0.5s infinite;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.7) !important;
        }

        .glare-effect {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
          pointer-events: none;
          opacity: 0.5;
          mix-blend-mode: overlay;
        }
      `}</style>
      <div className="glare-effect"></div>
      <div className="w-full max-w-[400px] mx-auto p-4 md:p-6 flex-grow">
        <div className="grid grid-cols-3 gap-4 w-full">
          {drumPads}
        </div>
        <div className="mt-4 w-full flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={handlePaletteChange}
              className={`p-1.5 rounded-full ${currentColorPalette.drumPad} hover:opacity-80 transition-opacity shadow-inner`}
              style={{ boxShadow: 'inset 0 2px 4px rgba(0,  0, 0, 0.1)' }}
              aria-label="Change color palette"
            >
              <Palette size={20} strokeWidth={1.5} className={currentColorPalette.text} />
            </button>
            <button
              onClick={handleThemeToggle}
              className={`p-1.5 rounded-full ${currentColorPalette.drumPad} hover:opacity-80 transition-opacity shadow-inner`}
              style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' }}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} strokeWidth={1.5} className={currentColorPalette.text} /> : <Moon size={20} strokeWidth={1.5} className={currentColorPalette.text} />}
            </button>
          </div>
          <div className="relative flex items-center"> {/* Updated div to include loading spinner */}
            {isKitLoading && (
              <Spinner className={`absolute left-[-24px] animate-spin ${currentColorPalette.text}`} size={16} />
            )}
            <Select onValueChange={handleKitChange} defaultValue={currentKit}>
              <SelectTrigger className={`w-[180px] ${currentColorPalette.select} border-none focus:ring-2 text-[8px] ${currentColorPalette.selectText} shadow-inner`} style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <SelectValue placeholder="Select a drum kit" />
              </SelectTrigger>
              <SelectContent className={`${currentColorPalette.selectContent} border-none`}>
                {Object.keys(drumKits).map((kitName) => (
                  <SelectItem key={kitName} value={kitName} className={`${currentColorPalette.selectItem} text-[8px] ${currentColorPalette.selectText}`}>
                    {kitName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={() => setIsHelpOpen(true)}
            className={`p-1.5 rounded-full ${currentColorPalette.drumPad} hover:opacity-80 transition-opacity shadow-inner`}
            style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' }}
            aria-label="How to use"
          >
            <HelpCircle size={20} strokeWidth={1.5} className={currentColorPalette.text} />
          </button>
        </div>
      </div>
      <div className="w-full max-w-[400px] mx-auto h-24 flex items-center justify-center">
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2235699957137388"
     crossOrigin="anonymous"></script>
    <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2235699957137388"
        data-ad-slot="8621285181"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
      </div>
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className={`${currentColorPalette.drumPad} max-w-[300px] p-4 mx-auto`}>
          <DialogHeader>
            <DialogTitle className={`text-sm font-bold mb-2 ${currentColorPalette.text}`}>How to Use</DialogTitle>
          </DialogHeader>
          <DialogDescription className={currentColorPalette.text}>
            <ul className="list-none pl-0 space-y-3.5 text-[10px]">
              <li>🎵 Click or tap a pad to play its sound</li>
              <li>🔄 Long press or right-click to change a pad&apos;s sound</li>
              <li>🖱️ Drag and drop audio files onto pads</li>
              <li>🥁 Use the dropdown to switch between drum kits</li>
              <li>🎨 Click the palette icon to change colors</li>
              <li>🌓 Toggle dark mode with the sun/moon icon</li>
            </ul>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}