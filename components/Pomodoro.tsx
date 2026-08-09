'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

type TimerMode = 'focus' | 'break';

export default function Pomodoro() {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const focusTime = 50 * 60; // 50 minutes
  const breakTime = 10 * 60; // 10 minutes

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsRunning(false);
      // Play notification sound or show alert
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('Pomodoro Timer', {
            body: mode === 'focus' ? 'Focus session complete! Time for a break.' : 'Break over! Ready to focus?',
          });
        }
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? focusTime : breakTime);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'focus' ? focusTime : breakTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((mode === 'focus' ? focusTime : breakTime) - timeLeft) / (mode === 'focus' ? focusTime : breakTime) * 100;

  return (
    <div className="glass-card rounded-2xl p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="text-blue-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Pomodoro Timer</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => switchMode('focus')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              mode === 'focus'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Focus
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              mode === 'break'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Break
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        {/* Progress ring */}
        <svg className="w-48 h-48 mx-auto transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-slate-800"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className={`transition-all duration-300 ${mode === 'focus' ? 'text-blue-500' : 'text-emerald-500'}`}
          />
        </svg>
        
        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-white mb-1">{formatTime(timeLeft)}</div>
            <div className="text-sm text-slate-400 capitalize">{mode} Mode</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            isRunning
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Pause size={20} />
              Pause
            </>
          ) : (
            <>
              <Play size={20} />
              Start
            </>
          )}
        </button>
        <button
          onClick={resetTimer}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-slate-800 hover:bg-slate-700 text-white transition-all"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>

      <div className="mt-4 text-center text-sm text-slate-500">
        {mode === 'focus' ? '50:10 Focus/Break Ratio' : 'Take a well-deserved break'}
      </div>
    </div>
  );
}
