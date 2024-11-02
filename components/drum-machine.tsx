"use client"

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Palette, Moon, Sun, HelpCircle, Loader2, Play, Square, Music, VolumeX, Volume2, ChevronUp, Trash2, Sliders, Grid, RotateCcw, Github } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Loader2 as Spinner } from "lucide-react"
import { motion, useAnimation, PanInfo, AnimatePresence } from "framer-motion"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

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
  return `${name.slice(0, mid - 2)}${name.slice(-mid + 1)}${extension}`;
};

const VolumeFader: React.FC<{ value: number; onChange: (value: number) => void; colorPalette: typeof colorPalettes[keyof typeof colorPalettes]['light' | 'dark'] }> = ({ value, onChange, colorPalette }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
    if ('touches' in event) {
      updateValue(event.touches[0] as unknown as MouseEvent);
    } else {
      updateValue(event);
    }
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (isDragging) {
        if ('touches' in event) {
          updateValue(event.touches[0] as unknown as MouseEvent);
        } else {
          updateValue(event);
        }
      }
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove); 
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const updateValue = (event: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const position = 1 - (event.clientY - rect.top) / rect.height;
      onChange(Math.min(1, Math.max(0, position)));
    }
  };

  return (
    <div className="relative w-6 h-[100px]">
      <div
        ref={sliderRef}
        className={`relative w-full h-full bg-gradient-to-r ${colorPalette.faderStart} ${colorPalette.faderEnd} shadow-inner rounded-[10px] cursor-pointer`}
        onMouseDown={handleMouseDown}
      >
        <div 
          className={`absolute z-0 top-1/2 left-1/2 w-[6px] h-[90px] shadow-lg transform -translate-x-1/2 -translate-y-1/2 rounded-[3px] ${
            colorPalette.faderKnob
          }`} 
        />
        <div
          className={`absolute z-10 w-[20px] h-[20px] rounded-full shadow-md cursor-pointer transition-all duration-100 ease-in-out ${
            colorPalette.faderKnob
          }`}
          style={{
            top: `${Math.min(Math.max((1 - value) * 100, 5), 95)}%`,
            transform: 'translate(-50%, -50%)',
            left: '50%',
          }}
        />
      </div>
    </div>
  );
};

const DrumPad = React.memo(({ pad, onPadTrigger, onShortPress, onLongPress, onDragEnter, onDragLeave, onDragOver, onDrop, isActive, isDraggedOver, fileInputRef, onFileInputChange, colorPalette }: {
  pad: DrumPad
  onPadTrigger: (e: React.MouseEvent | React.TouchEvent, padId: number) => void
  onShortPress: () => void
  onLongPress: () => void
  onDragEnter: (e: React.DragEvent<HTMLButtonElement>, padId: number) => void
  onDragLeave: (e: React.DragEvent<HTMLButtonElement>) => void
  onDragOver: (e: React.DragEvent<HTMLButtonElement>) => void
  onDrop: (e: React.DragEvent<HTMLButtonElement>, padId: number) => void
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
  const [recentlyTriggered, setRecentlyTriggered] = useState(false);

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
        x = touchEvent.touches[0].clientX;
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
          onPadTrigger(e, pad.id)
          setRecentlyTriggered(true)
          setTimeout(() => setRecentlyTriggered(false), 100) // Reset after 100ms
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
        {!pad.isAvailable && <span className="unavailable-icon mr-1 pt-[4px]" aria-label="Sound unavailable"></span>}
        <div className={`name-content text-[12px] ${colorPalette.text} flex-grow text-center`} title={pad.sound.name}>
          {truncatedName}
        </div>
      </div>
      <button
        ref={padRef}
        className={`drum-pad w-full aspect-square ${colorPalette.drumPad} shadow-md
          cursor-pointer transition-all duration-200  
          rounded-lg p-4
          ${pad.sound.borderColor}
          ${isActive ? 'opacity-75' : ''}
          ${isDraggedOver ? 'drag-over' : ''}
          ${recentlyTriggered ? 'bg-opacity-80' : ''}`}
        style={{
          transform: `perspective(1000px) rotateX(${pressPosition.y * 10}deg) rotateY(${pressPosition.x * 10}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        onDragEnter={(e) => onDragEnter(e, pad.id)}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, pad.id)}
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

const DrumSequencer = ({ currentKit, bpm, setBpm, colorPalette, pads, playSound, audioContext, audioBuffers, volumeLevels, setVolumeLevels, isDarkMode, mutedPads, setMutedPads }: {
  currentKit: string;
  bpm: number;
  setBpm: React.Dispatch<React.SetStateAction<number>>;
  colorPalette: typeof colorPalettes[keyof typeof colorPalettes]['light' | 'dark'];
  pads: DrumPad[];
  playSound: (url: string, padId: number, volume: number) => void;
  audioContext: AudioContext | null;
  audioBuffers: { [key: string]: AudioBuffer };
  volumeLevels: number[];
  setVolumeLevels: React.Dispatch<React.SetStateAction<number[]>>;
  isDarkMode: boolean;
  mutedPads: boolean[];
  setMutedPads: React.Dispatch<React.SetStateAction<boolean[]>>;
}) => {
  const [sequence, setSequence] = useState(Array(9).fill(Array(16).fill(false)))
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const requestRef = useRef<number | null>(null)
  const previousTimeRef = useRef<number | null>(null)
  const stepDuration = useRef(60 / bpm / 4)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isResetAlertOpen, setIsResetAlertOpen] = useState(false);
  const [isMixerVisible, setIsMixerVisible] = useState(false)

  const toggleStep = (row: number, col: number) => {
    setSequence(prevSequence => 
      prevSequence.map((r, i) => 
        i === row ? r.map((step: any, j: number) => j === col ? !step : step) : r
      )
    )
  }

  const playStep = (step: number) => {
    sequence.forEach((row, padIndex) => {
      if (row[step] && pads[padIndex] && pads[padIndex].isAvailable && !mutedPads[padIndex]) {
        playSound(pads[padIndex].sound.url, pads[padIndex].id, volumeLevels[padIndex])
      }
    })
  }

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current === null) {
      previousTimeRef.current = time
    }

    const deltaTime = time - previousTimeRef.current
    if (deltaTime >= stepDuration.current * 1000) {
      playStep(currentStep)
      setCurrentStep((prevStep) => (prevStep + 1) % 16)
      previousTimeRef.current = time
    }

    requestRef.current = requestAnimationFrame(animate)
  }, [currentStep, playSound, pads, sequence, stepDuration, volumeLevels, mutedPads])

  useEffect(() => {
    stepDuration.current = 60 / bpm / 4
  }, [bpm])

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate)
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
      setCurrentStep(0)
      previousTimeRef.current = null
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isPlaying, animate])

  const getCellColor = (isActive: boolean, isCurrentStep: boolean, padColor: string, isMuted: boolean) => {
    if (isMuted) {
      return 'bg-gray-400 bg-opacity-50'
    }
    if (isActive) {
      return `${padColor.replace('border-', 'bg-')} opacity-75`
    }
    if (isCurrentStep) {
      return `${colorPalette.select} bg-opacity-50`
    }
    return colorPalette.sequencerCellBackground;
  }

  const getSampleNameColor = () => {
    return colorPalette.background === 'bg-gray-100' ? 'bg-gray-200' : colorPalette.select
  }

  const toggleMute = (index: number) => {
    setMutedPads(prev => {
      const newMutedPads = [...prev]
      newMutedPads[index] = !newMutedPads[index]
      return  newMutedPads
    })
  }

  const resetSequence = () => {
    setSequence(Array(9).fill(Array(16).fill(false)));
  };

  const resetMixer = () => {
    setVolumeLevels(Array(9).fill(1));
  };

  useEffect(() => {
    resetSequence();
  }, [currentKit]);

  return (
    <motion.div
      className={`fixed bottom-0 left-0 right-0 ${colorPalette.drumPad} rounded-t-lg max-w-[642px] w-full m-auto overflow-hidden shadow-lg`}
      initial={{ y: 310 }}
      animate={{ y: isExpanded ? 0 : 310 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 rounded-md ${colorPalette.button} hover:opacity-80 transition-opacity`}
              aria-label={isPlaying ? "Stop" : "Play"}
            >
              {isPlaying ? <Square size={20} strokeWidth={1.5} className={colorPalette.buttonText} /> : <Play size={20} strokeWidth={1.5} className={colorPalette.buttonText} />}
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-1.5 rounded-full ${colorPalette.button} hover:opacity-80 transition-opacity`}
              aria-label={isExpanded ? "Close sequencer" : "Open sequencer"}
            >
              <Grid size={20} strokeWidth={1.5} className={`${colorPalette.buttonText} transform ${isExpanded ? 'rotate-180' : ''} transition-transform duration-300`} />
            </button>
            <button
              onClick={() => setIsMixerVisible(!isMixerVisible)}
              className={`p-1.5 rounded-full ${colorPalette.button} hover:opacity-80 transition-opacity`}
              aria-label="Toggle mixer"
            >
              <Sliders size={20} strokeWidth={1.5} className={`${colorPalette.buttonText} transform transition-transform duration-300 ${isMixerVisible ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Music size={18} strokeWidth={1.5} className={`mr-2 ${colorPalette.text}`} />
              <input
                type="number"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className={`w-20 px-2 py-1 text-xs rounded ${colorPalette.input} ${colorPalette.inputText}`}
                min="60"
                max="200"
              />
            </div>
            <button
              onClick={resetMixer}
              className={`p-1.5 rounded-full ${colorPalette.button} hover:opacity-80 transition-opacity`}
              aria-label="Reset mixer"
            >
              <RotateCcw size={20} strokeWidth={1.5} className={colorPalette.buttonText} />
            </button>
            <AlertDialog open={isResetAlertOpen} onOpenChange={setIsResetAlertOpen}>
              <AlertDialogTrigger asChild>
                <button
                  className={`p-1.5 rounded-full ${colorPalette.button} hover:opacity-80 transition-opacity`}
                  aria-label="Reset sequence"
                >
                  <Trash2 size={20} strokeWidth={1.5} className={colorPalette.buttonText} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className={`${colorPalette.drumPad}`}>
                <AlertDialogHeader>
                  <AlertDialogTitle className={colorPalette.text}>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription className={colorPalette.text}>
                    This will clear all highlighted cells in the sequence.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className={`${colorPalette.button} ${colorPalette.buttonText}`}>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => {
                      resetSequence();
                      setIsResetAlertOpen(false);
                    }}
                    className={`${colorPalette.button} hover:bg-[#F87171] ${colorPalette.buttonText}`}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <AnimatePresence>
          {isMixerVisible && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 180, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`relative rounded-lg overflow-hidden`}
            >
              <div className="p-2 grid grid-cols-9 gap-4">
                {pads.map((pad, index) => (
                  <div key={pad.id} className="flex flex-col items-center">
                    <div className={`${colorPalette.text} text-[12px] mb-4 truncate w-full text-center font-semibold`} title={pad.sound.name}>
                      {pad.sound.name}
                    </div>
                    <VolumeFader
                      value={volumeLevels[index]}
                      onChange={(value) => {
                        const newVolumeLevels = [...volumeLevels];
                        newVolumeLevels[index] = value;
                        setVolumeLevels(newVolumeLevels);
                      }}
                      colorPalette={colorPalette}
                    />
                    <button
                      onClick={() => toggleMute(index)}
                      className={`mt-2 p-0.5 rounded-full hover:opacity-80 transition-opacity`}
                      aria-label={mutedPads[index] ? 'Unmute' : 'Mute'}
                    >
                      {mutedPads[index] ? <VolumeX size={12} className={colorPalette.buttonText} /> : <Volume2 size={12} className={colorPalette.buttonText} />}
                    </button>
                  </div>
                ))}
              </div>
            <div className="absolute h-2 bg-white w-ful rounded-mb">
              
            </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex overflow-x-auto rounded-md">
          <div className="w-28 flex-shrink-0">
            {pads.map((pad, index) => (
              <div key={index} className={`h-8 pl-2 flex items-center justify-between ${colorPalette.text} text-[10px] ${getSampleNameColor()} border-b border-r border-l ${colorPalette.sampleNameBorder} ${colorPalette.select} ${mutedPads[index] ? 'bg-gray-400 bg-opacity-50' : ''}`}>
                <span className="truncate mr-1" style={{ maxWidth: 'calc(100% - 24px)' }}>{pad.sound.name}</span>
                <button
                  onClick={() => toggleMute(index)}
                  className={`p-0.5 rounded-full hover:opacity-80 transition-opacity mr-1`}
                  aria-label={mutedPads[index] ? 'Unmute' : 'Mute'}
                >
                  {mutedPads[index] ? <VolumeX size={10} className={colorPalette.buttonText} /> : <Volume2 size={10} className={colorPalette.buttonText} />}
                </button>
              </div>
            ))}
          </div>
          <div className="flex-shrink-0" style={{ width: '496px' }}>
            <div className="grid grid-cols-16 gap-0">
              {sequence.map((row, i) => (
                <React.Fragment key={i}>
                  {row.map((isActive: boolean, j: number) => (
                    <button
                      key={`${i}-${j}`}
                      className={`w-8 h-8 border-r border-b border-l border-t border-gray-300 ${getCellColor(isActive, j === currentStep, pads[i].sound.borderColor, mutedPads[i])}`}
                      onClick={() => toggleStep(i, j)}
                      style={{
                        backgroundColor: isActive ? pads[i].sound.borderColor.replace('border-', '').replace('[#', '#').replace(']', '') : undefined,
                      }}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const drumKits = {
  "Vibrant Kit": [
    { name: 'Kick', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kick-eTh6TIINaEetn88UbAYzGRaAVd4WcG.wav', borderColor: 'border-[#F87171]' },
    { name: 'Crash', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crash-lbPMEPtZC09eRtgWxXCIgIRKpinMZU.wav', borderColor: 'border-[#60A5FA]' },
    { name: 'Hi Hat Closed', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hihat_closed-eLi0aR7n2AJnmKO6FtTNTw10bpurEc.wav', borderColor: 'border-[#4ADE80]' },
    { name: 'Hi-Hat Open', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hihat_open-H8OXp9Wqi1xerVnaCu6mHIQYMBbjyP.wav', borderColor: 'border-[#FACC15]' },
    { name: 'Perc', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/perc-N1s00QTtmtSBmSlmVvjdzzf7MJMQ4U.wav', borderColor: 'border-[#C084FC]' },
    { name: 'Vox', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vox-jVkgJwy9Jahqj62QRXyy1jhyWFCvXN.wav', borderColor: 'border-[#F472B6]' },
    { name: 'Perc 2', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/perc2-0rWucOBjkPBgDRcoFd7Aw3dauf4Low.wav', borderColor: 'border-[#818CF8]' },
    { name: 'Snare', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/snare-vrheliJVK5rA9BnvkaWj3aHEl3YDqT.wav', borderColor: 'border-[#FB923C]' },
    { name: 'Cowbell', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cowbell-R1O3yRID1F9JV7iKoQBbtLpcsfSEWF.wav', borderColor: 'border-[#2DD4BF]' },
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
      selectItem: 'focus:bg-[#E4DCCF]',
      text: 'text-[#002B5B]',
      selectText: 'text-[#002B5B]',
      button: 'bg-[#E4DCCF]',
      buttonText: 'text-[#002B5B]',
      input: 'bg-white',
      inputText: 'text-gray-800',
      mixerBackground: '#b3a795',
      fader: 'bg-[#b9a2a2]',
      sequencerCell: 'bg-indigo-100',
      sequencerCellBackground: 'bg-white',
      faderStart: 'bg-[#E4DCCF]',
      faderEnd: 'bg-[#D0C9BC]',
      faderKnob: 'bg-[#9b8f88]',
      sampleNameBorder: 'border-gray-300',
    },
    dark: {
      background: 'bg-[#1A1A2E]',
      drumPad: 'bg-[#16213E]',
      select: 'bg-[#0F3460]',
      selectContent: 'bg-[#16213E]',
      selectItem: 'bg-[#0F3460] focus:bg-[#0F3460]',
      text: 'text-[#E8E8E8]',
      selectText: 'text-[#E8E8E8]',
      button: 'bg-[#0F3460]',
      buttonText: 'text-[#E8E8E8]',
      input: 'bg-[#16213E]',
      inputText: 'text-[#E8E8E8]',
      mixerBackground: 'bg-[#16213E]',
      fader: '#0F3460',
      sequencerCell: 'bg-[#0F3460]',
      sequencerCellBackground: 'bg-[#16213E]',
      faderStart: 'bg-[#16213E]',
      faderEnd: 'bg-[#0F3460]',
      faderKnob: 'bg-[#E8E8E8]',
      sampleNameBorder: 'border-[#0F3460]',
    },
  },
}

export default function Component() {
  console.log('Drum Machine component is rendering');
  const [isLoading, setIsLoading] = useState(true)
  const [isFontLoaded, setIsFontLoaded] = useState(false)
  const [currentKit, setCurrentKit] = useState("Vibrant Kit")
  const [pads, setPads] = useState<DrumPad[]>([])
  const [activePad, setActivePad] = useState<number | null>(null)
  const [draggedOver, setDraggedOver] = useState<number | null>(null)
  const [currentPalette, setCurrentPalette] = useState<keyof typeof colorPalettes>('indigo')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isKitLoading, setIsKitLoading] = useState(false)
  const [mutedPads, setMutedPads] = useState<boolean[]>(Array(9).fill(false))
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const audioContext = useRef<AudioContext | null>(null)
  const audioBuffers = useRef<{ [key: string]: AudioBuffer }>({})
  const gainNodes = useRef<{ [key: number]: GainNode }>({})
  const [bpm, setBpm] = useState(120)
  const [volumeLevels, setVolumeLevels] = useState<number[]>(Array(9).fill(1))
  const [isExpanded, setIsExpanded] = useState(false);

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

  const initializePads = useCallback(async (kitName: string) => {
    initializeAudioContext()
    const newPads = await Promise.all(
      drumKits[kitName as keyof typeof drumKits].map(async (sound: { url: string; name: string; borderColor: string }, index: number) => {
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
      await initializePads(currentKit)
      setIsLoading(false)
      setIsKitLoading(false)
      console.log('App loaded, isLoading set to false');
    }
    loadApp()
  }, [currentKit, initializePads, pads.length])

  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace(
        'Press Start 2P',
        'url(https://fonts.gstatic.com/s/pressstart2p/v14/e3t4euO8T-267oIAQAu6jDQyK3nVivNm4I81.woff2) format("woff2")'
      );
      try {
        await font.load();
        document.fonts.add(font);
        setIsFontLoaded(true);
      } catch (error) {
        console.error('Error loading font:', error);
        // Fallback to ensure the app loads even if the font fails to load
        setIsFontLoaded(true);
      }
    };
    loadFont();
  }, []);

  const playSound = useCallback((url: string, padId: number, volume: number) => {
    if (!audioContext.current) return

    const source = audioContext.current.createBufferSource()
    source.buffer = audioBuffers.current[url]

    if (!gainNodes.current[padId]) {
      const gainNode = audioContext.current.createGain()
      gainNode.connect(audioContext.current.destination)
      gainNodes.current[padId] = gainNode
    }

    const gainNode = gainNodes.current[padId]
    gainNode.gain.setValueAtTime(volume, audioContext.current.currentTime)
    source.connect(gainNode)
    source.start(0)

    setActivePad(padId)
  }, [])

  const handlePadTrigger = useCallback((e: React.MouseEvent | React.TouchEvent, padId: number) => {
    e.preventDefault()
    const pad = pads[padId]
    if (pad && pad.isAvailable) {
      playSound(pad.sound.url, padId, volumeLevels[padId])
    }
  }, [pads, playSound, volumeLevels])

  const handleShortPress = useCallback((padId: number) => {
    const pad = pads[padId]
    if (pad && !pad.isAvailable) {
      fileInputRefs.current[padId]?.click()
    }
  }, [pads])

  const handleLongPress = useCallback((padId: number) => {
    fileInputRefs.current[padId]?.click()
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
    setIsKitLoading(true)
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
    pads.map((pad) => (
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
        fileInputRef={{current: fileInputRefs.current[pad.id]}}
        onFileInputChange={(e) => handleFileInputChange(e, pad.id)}
        colorPalette={currentColorPalette}
      />
    ))
  ), [pads, handlePadTrigger, handleShortPress, handleLongPress, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleFileInputChange, activePad, draggedOver, currentColorPalette])

  if (isLoading || !isFontLoaded) {
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
        <span className="loader"></span>
      </div>
    )
  } else {
    return (
      <div className={`w-full min-h-screen ${currentColorPalette.background} flex flex-col justify-start items-center relative overflow-hidden`}>
        <style jsx global>{`
          body {
            font-family: 'Press Start 2P', monospace;
            display: flex;
            font-size: 12px;
            font-weight: 800;
            flex-direction: column;
            min-height: 100vh;
            overflow: hidden;
          }
          body.dark {
            background-image: url('https://assets.codepen.io/4175254/ep-133-noise-dark.png');
            background-color: #1a202c;
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
            border-width: 2px;
            border-style: solid;
          }
          .dark .drum-pad {
          }

          .drum-pad:active {
            transform: scale(0.98);
          }
          .dark .drum-pad:active {
          }

          .unavailable-icon {
            display: inline-block;
            width: 8px;
            height: 8px;
            margin-right: 4px;
            margin-top;4px;
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
            box-shadow: 0 0 15px rgba(255,255,255,0.7) !important;
          }

          .grid-cols-16 {
            grid-template-columns: repeat(16, minmax(0, 1fr));
          }
        `}</style>
        <div className="w-full max-w-[400px] mx-auto p-4 md:p-6 flex-grow">
          <div className="grid grid-cols-3 gap-4 w-full">
            {drumPads}
          </div>
          <div className="mt-4 w-full flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={handleThemeToggle}
                className={`p-1.5 rounded-full ${currentColorPalette.button} hover:opacity-80 transition-opacity`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} strokeWidth={1.5} className={currentColorPalette.buttonText} /> : <Moon size={20} strokeWidth={1.5} className={currentColorPalette.buttonText} />}
              </button>
            </div>
            <div className="relative flex items-center">
              {isKitLoading && (
                <Spinner className={`absolute left-[-24px] animate-spin ${currentColorPalette.text}`} size={16} />
              )}
              <Select onValueChange={handleKitChange} defaultValue={currentKit}>
                <SelectTrigger className={`w-[180px] ${currentColorPalette.select} border-none focus:ring-2 text-[12px] ${currentColorPalette.selectText}`}>
                  <SelectValue placeholder="Select a drum kit" />
                </SelectTrigger>
                <SelectContent className={`${currentColorPalette.selectContent} border-none`}>
                  {Object.keys(drumKits).map((kitName) => (
                    <SelectItem key={kitName} value={kitName} className={`${currentColorPalette.selectItem} text-[12px] ${currentColorPalette.selectText}`}>
                      {kitName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <button
              onClick={() => setIsHelpOpen(true)}
              className={`p-1.5 rounded-full ${currentColorPalette.button} hover:opacity-80 transition-opacity`}
              aria-label="How to use"
            >
              <HelpCircle size={20} strokeWidth={1.5} className={currentColorPalette.buttonText} />
            </button>
          </div>
        </div>
        <DrumSequencer
          currentKit={currentKit}
          bpm={bpm}
          setBpm={setBpm}
          colorPalette={currentColorPalette}
          pads={pads}
          playSound={playSound}
          audioContext={audioContext.current}
          audioBuffers={audioBuffers.current}
          volumeLevels={volumeLevels}
          setVolumeLevels={setVolumeLevels}
          isDarkMode={isDarkMode}
          mutedPads={mutedPads}
          setMutedPads={setMutedPads}
        />
        <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
          <DialogContent className={`${currentColorPalette.drumPad} max-w-[320px] round-sm p-4 mx-auto`}>
            <DialogHeader>
              <DialogTitle className={`text-sm font-bold mb-2 ${currentColorPalette.text}`}>How to Use</DialogTitle>
            </DialogHeader>
            <DialogDescription className={currentColorPalette.text}>
              <ul className="list-none pl-0 space-y-3.5 text-[10px]">
                <li>🎵 Click or tap a pad to play its sound</li>
                <li>🔄 Long press or right-click to change a pad&apos;s sound</li>
                <li>🖱️ Drag and drop audio files onto pads</li>
                <li>🥁 Use the dropdown to switch between drum kits</li>
                <li>🎚️ Adjust volume levels and mute pads in the mixer</li>
                <li>🎼 Create patterns using the sequencer</li>
                <li>⏯️ Use play/stop button to control the sequence</li>
                <li>🌓 Toggle dark mode with the sun/moon icon</li>
                <li className="mt-4">
                  <a 
                    href="https://github.com/kunisensei92" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${currentColorPalette.button} ${currentColorPalette.buttonText} px-3 py-2 rounded-md text-center block hover:opacity-80 transition-opacity flex items-center justify-center`}
                  >
                    <Github size={16} className="mr-2" />
                    My GitHub Profile
                  </a>
                </li>
                <li className="mt-4">
                  <a href="https://www.buymeacoffee.com/kunisama" target="_blank">
                    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" className={`w-[217px] h-[60px] m-auto border-2 border-black rounded-[12px]`} />
                  </a>
                </li>
              </ul>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}