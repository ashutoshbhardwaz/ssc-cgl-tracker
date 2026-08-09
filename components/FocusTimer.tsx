'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Coffee, Zap, Play, Pause, RotateCcw, SkipForward, 
  Trophy, Flame, Volume2, VolumeX, Edit, Target, Droplets, 
  PhoneOff, Footprints, Sparkles 
} from 'lucide-react';
import { useStudyStore } from '@/lib/store';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface ModeConfig {
  name: string;
  duration: number; // in minutes
  accent: string;
  icon: any;
  label: string;
}

const modeConfigs: Record<TimerMode, ModeConfig> = {
  focus: {
    name: 'Deep Focus',
    duration: 50,
    accent: 'purple',
    icon: Brain,
    label: 'Focus block',
  },
  shortBreak: {
    name: 'Short Break',
    duration: 10,
    accent: 'emerald',
    icon: Coffee,
    label: 'Rest time',
  },
  longBreak: {
    name: 'Long Break',
    duration: 30,
    accent: 'blue',
    icon: Zap,
    label: 'Deep rest',
  },
};

export default function FocusTimer() {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(modeConfigs[mode].duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [customDurations, setCustomDurations] = useState(modeConfigs);
  const [editingMode, setEditingMode] = useState<TimerMode | null>(null);
  
  const { totalStudyMinutes, cyclesCompleted, addStudyMinutes, completeCycle, addXP } = useStudyStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const secondsRef = useRef(0);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        secondsRef.current += 1;
        
        // Add XP every minute (60 seconds)
        if (secondsRef.current % 60 === 0 && mode === 'focus') {
          addXP(1);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, mode, addXP]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === 'focus') {
      const minutesStudied = customDurations.focus.duration;
      addStudyMinutes(minutesStudied);
      completeCycle();
      addXP(minutesStudied); // Bonus XP for completing full session
      
      // Play notification sound
      if (soundEnabled && typeof window !== 'undefined' && 'AudioContext' in window) {
        playNotificationSound();
      }
      
      // Browser notification
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Focus Session Complete!', {
          body: `Great job! You earned ${minutesStudied} XP. Time for a break.`,
        });
      }
    }
    
    // Auto-switch to break after focus
    if (mode === 'focus') {
      setMode('shortBreak');
      setTimeLeft(customDurations.shortBreak.duration * 60);
    }
  };

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(customDurations[mode].duration * 60);
    secondsRef.current = 0;
  };

  const skipTimer = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      setMode('shortBreak');
      setTimeLeft(customDurations.shortBreak.duration * 60);
    } else {
      setMode('focus');
      setTimeLeft(customDurations.focus.duration * 60);
    }
    secondsRef.current = 0;
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(customDurations[newMode].duration * 60);
    secondsRef.current = 0;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((customDurations[mode].duration * 60 - timeLeft) / (customDurations[mode].duration * 60)) * 100;

  const updateCustomDuration = (timerMode: TimerMode, newDuration: number) => {
    setCustomDurations((prev) => ({
      ...prev,
      [timerMode]: { ...prev[timerMode], duration: newDuration },
    }));
    if (mode === timerMode && !isRunning) {
      setTimeLeft(newDuration * 60);
    }
    setEditingMode(null);
  };

  const currentConfig = modeConfigs[mode];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mode Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.keys(modeConfigs) as TimerMode[]).map((modeKey) => {
                const config = modeConfigs[modeKey];
                const Icon = config.icon;
                const isActive = mode === modeKey;
                
                return (
                  <motion.button
                    key={modeKey}
                    onClick={() => switchMode(modeKey)}
                    className={`relative p-4 rounded-xl border transition-all duration-300 ${
                      isActive
                        ? `bg-${config.accent}-500/10 border-${config.accent}-500/50 shadow-${config.accent}-500/20 shadow-lg`
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-${config.accent}-500/20 flex items-center justify-center`}>
                        <Icon size={20} className={`text-${config.accent}-400`} />
                      </div>
                      <div className="text-left">
                        <h3 className={`font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                          {config.name}
                        </h3>
                        <p className={`text-sm ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>
                          {customDurations[modeKey].duration} min
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeMode"
                        className={`absolute inset-0 rounded-xl border-2 border-${config.accent}-500/30 pointer-events-none`}
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Core Timer UI */}
            <div className={`glass-card rounded-2xl p-8 border-2 transition-all duration-300 ${
              isRunning ? `border-${currentConfig.accent}-500/50 shadow-${currentConfig.accent}-500/20 shadow-xl` : 'border-slate-800'
            }`}>
              {/* Mode Badge */}
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`px-4 py-2 rounded-full bg-${currentConfig.accent}-500/20 border border-${currentConfig.accent}-500/30 text-${currentConfig.accent}-400 text-sm font-medium`}
                >
                  {currentConfig.label}
                </motion.div>
              </div>

              {/* Timer Display */}
              <div className="relative mb-8">
                <motion.div
                  animate={isRunning ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                  transition={{ duration: 2, repeat: isRunning ? Infinity : 0 }}
                  className="text-center"
                >
                  <h1 className="text-7xl lg:text-8xl font-bold text-white tracking-tight">
                    {formatTime(timeLeft)}
                  </h1>
                </motion.div>
                
                {/* Progress Ring */}
                <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 -rotate-90 opacity-20">
                  <circle
                    cx="160"
                    cy="160"
                    r="140"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-slate-700"
                  />
                  <motion.circle
                    cx="160"
                    cy="160"
                    r="140"
                    stroke={`var(--${currentConfig.accent}-500)`}
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 140}`}
                    strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    className={`text-${currentConfig.accent}-500`}
                    animate={{ strokeDashoffset: 2 * Math.PI * 140 * (1 - progress / 100) }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.button
                  onClick={resetTimer}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RotateCcw size={24} />
                </motion.button>
                
                <motion.button
                  onClick={toggleTimer}
                  className={`p-6 rounded-2xl bg-${currentConfig.accent}-500 hover:bg-${currentConfig.accent}-600 text-white shadow-${currentConfig.accent}-500/30 shadow-xl transition-all`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {isRunning ? (
                      <motion.div
                        key="pause"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Pause size={32} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Play size={32} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
                
                <motion.button
                  onClick={skipTimer}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <SkipForward size={24} />
                </motion.button>
              </div>

              {/* XP Banner */}
              {mode === 'focus' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
                    <Sparkles size={16} />
                    <span>Completing this block earns XP & updates your daily Safar streak</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cycles Done */}
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Trophy size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{cyclesCompleted}</p>
                    <p className="text-xs text-slate-400">Cycles Today</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Flame size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{isRunning ? 'Focus' : 'Resting'}</p>
                    <p className="text-xs text-slate-400">Current Status</p>
                  </div>
                </div>
              </div>

              {/* Sound Toggle */}
              <motion.button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`glass-card rounded-xl p-4 transition-all ${soundEnabled ? 'border-emerald-500/30' : 'border-slate-800'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${soundEnabled ? 'bg-emerald-500/20' : 'bg-slate-800'} flex items-center justify-center`}>
                    {soundEnabled ? (
                      <Volume2 size={20} className="text-emerald-400" />
                    ) : (
                      <VolumeX size={20} className="text-slate-500" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-white">
                      {soundEnabled ? 'On' : 'Off'}
                    </p>
                    <p className="text-xs text-slate-400">Sound</p>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Custom Duration Settings */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Edit size={20} className="text-purple-400" />
                Custom Durations
              </h3>
              <div className="space-y-3">
                {(Object.keys(modeConfigs) as TimerMode[]).map((modeKey) => {
                  const config = modeConfigs[modeKey];
                  const Icon = config.icon;
                  const isEditing = editingMode === modeKey;
                  
                  return (
                    <div key={modeKey} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={`text-${config.accent}-400`} />
                        <span className="text-slate-300">{config.name}</span>
                      </div>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="120"
                            defaultValue={customDurations[modeKey].duration}
                            onBlur={(e) => updateCustomDuration(modeKey, parseInt(e.target.value) || config.duration)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                updateCustomDuration(modeKey, parseInt((e.target as HTMLInputElement).value) || config.duration);
                              }
                            }}
                            className="w-16 px-2 py-1 rounded bg-slate-800 text-white text-center border border-slate-700 focus:border-purple-500 focus:outline-none"
                            autoFocus
                          />
                          <span className="text-slate-500 text-sm">min</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{customDurations[modeKey].duration} min</span>
                          <button
                            onClick={() => setEditingMode(modeKey)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SSC CGL Quick Tips */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target size={20} className="text-blue-400" />
                SSC CGL Quick Tips
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50">
                  <span className="text-lg">🎯</span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    One subject per session — multitasking cuts retention by 40%.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50">
                  <span className="text-lg">💧</span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Keep water nearby. Mild dehydration hurts focus.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50">
                  <span className="text-lg">🚫</span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Phone face-down, notifications off. No calculators during arithmetic.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50">
                  <span className="text-lg">🚶‍♂️</span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Short walk during breaks resets the mind for the next lecture.
                  </p>
                </div>
              </div>
            </div>

            {/* XP & Stats Info */}
            <div className="glass-card rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-purple-400" />
                XP & Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50">
                  <span className="text-slate-400 text-sm">Total Study Time</span>
                  <span className="text-white font-semibold">{Math.floor(totalStudyMinutes / 60)}h {totalStudyMinutes % 60}m</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50">
                  <span className="text-slate-400 text-sm">Current XP</span>
                  <span className="text-purple-400 font-semibold">{totalStudyMinutes + cyclesCompleted * 50} XP</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50">
                  <span className="text-slate-400 text-sm">Focus Cycles</span>
                  <span className="text-white font-semibold">{cyclesCompleted}</span>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs text-purple-300 leading-relaxed">
                    <strong>💡 How XP Works:</strong> 1 minute of focus = 1 XP. Completing a full session = bonus 50 XP. Break blocks don't add XP. Track your progress on the main Dashboard!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
