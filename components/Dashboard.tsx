'use client';

import { subjectsData, phases, dailyRoutine } from '@/lib/data';
import { Target, TrendingUp, Clock, CheckCircle, BookOpen, Moon, Play, PenTool } from 'lucide-react';

interface DashboardProps {
  subjectProgress: Record<string, number>;
}

export default function Dashboard({ subjectProgress }: DashboardProps) {
  const totalLectures = subjectsData.reduce((sum, subject) => sum + subject.totalLectures, 0);
  const totalCompleted = Object.values(subjectProgress).reduce((sum, progress) => {
    const subject = subjectsData.find(s => subjectProgress[s.id] !== undefined);
    if (subject) {
      return sum + Math.round((progress / 100) * subject.totalLectures);
    }
    return sum;
  }, 0);
  
  const overallProgress = totalLectures > 0 ? Math.round((totalCompleted / totalLectures) * 100) : 0;

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'from-emerald-500 to-green-600';
    if (progress >= 50) return 'from-blue-500 to-cyan-600';
    if (progress >= 25) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Master Dashboard</h1>
        <p className="text-slate-400">SAFAR 3.0 - Your SSC CGL 2027 Preparation Journey</p>
      </div>

      {/* Overall Progress */}
      <div className="glass-card rounded-2xl p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Total Syllabus Completion</h2>
            <p className="text-slate-400 text-sm">Across all subjects</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white">{overallProgress}%</p>
            <p className="text-slate-400 text-sm">{totalCompleted}/{totalLectures} lectures</p>
          </div>
        </div>
        <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getProgressColor(overallProgress)} transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Subject Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjectsData.map((subject) => {
          const progress = subjectProgress[subject.id] || 0;
          const completedLectures = Math.round((progress / 100) * subject.totalLectures);
          
          return (
            <div
              key={subject.id}
              className={`glass-card rounded-xl p-5 hover:scale-[1.02] transition-transform duration-200 ${subject.glowClass}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{subject.name}</h3>
                  <p className="text-xs text-slate-400">{subject.faculty}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${subject.color}-500/20 to-${subject.color}-600/20 flex items-center justify-center`}>
                  <BookOpen size={18} className={`text-${subject.color}-400`} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white font-medium">{progress}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-${subject.color}-500 to-${subject.color}-600 transition-all duration-300 rounded-full`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {completedLectures}/{subject.totalLectures} lectures completed
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Study Routine */}
      <div className="glass-card rounded-2xl p-6 lg:p-8">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Clock className="text-blue-400" size={24} />
          Daily Study Routine
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {dailyRoutine.map((item, index) => {
            const icons: Record<string, any> = {
              moon: Moon,
              'play-circle': Play,
              'book-open': BookOpen,
              'pen-tool': PenTool,
              target: Target,
            };
            const Icon = icons[item.icon];
            
            return (
              <div key={item.id} className="relative">
                <div className="glass-card rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Icon size={20} className="text-blue-400" />
                  </div>
                  <h3 className="font-medium text-white text-sm mb-1">{item.step}</h3>
                  <p className="text-xs text-slate-400">{item.time}</p>
                </div>
                {index < dailyRoutine.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-slate-600">
                    <TrendingUp size={16} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Phases Timeline */}
      <div className="glass-card rounded-2xl p-6 lg:p-8">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Target className="text-purple-400" size={24} />
          Preparation Phases
        </h2>
        <div className="space-y-4">
          {phases.map((phase, index) => (
            <div key={phase.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === 0
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                      : 'bg-slate-800'
                  }`}
                >
                  <span className="text-white font-semibold text-sm">{phase.id}</span>
                </div>
                {index < phases.length - 1 && (
                  <div className="w-0.5 h-12 bg-slate-800 mt-2" />
                )}
              </div>
              <div className="flex-1 glass-card rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white mb-1">{phase.name}</h3>
                    <p className="text-sm text-slate-400">{phase.description}</p>
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
                    {phase.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="text-center py-8">
        <p className="text-xl text-slate-300 italic">
          "The secret of getting ahead is getting started."
        </p>
        <p className="text-sm text-slate-500 mt-2">— Mark Twain</p>
      </div>
    </div>
  );
}
