'use client';

import { subjectsData, phases, dailyRoutine } from '@/lib/data';
import { Target, TrendingUp, Clock, CheckCircle, BookOpen, Moon, Play, PenTool, Download, Upload } from 'lucide-react';
import { useStudyStore } from '@/lib/store';
import CircularProgress from './CircularProgress';
import Heatmap from './Heatmap';
import Pomodoro from './Pomodoro';

export default function Dashboard() {
  const { subjects, exportProgress, importProgress, resetProgress } = useStudyStore();

  const calculateSubjectProgress = (subjectId: string) => {
    const subjectProgress = subjects[subjectId] || {};
    const subject = subjectsData.find(s => s.id === subjectId);
    if (!subject) return 0;

    const completedLectures = Object.values(subjectProgress).filter(
      (progress) =>
        progress.lectureWatched &&
        progress.practiceDone &&
        progress.pyqDone &&
        progress.revisionDone
    ).length;

    return Math.round((completedLectures / subject.totalLectures) * 100);
  };

  const totalLectures = subjectsData.reduce((sum, subject) => sum + subject.totalLectures, 0);
  const totalCompleted = subjectsData.reduce((sum, subject) => {
    const progress = calculateSubjectProgress(subject.id);
    return sum + Math.round((progress / 100) * subject.totalLectures);
  }, 0);
  
  const overallProgress = totalLectures > 0 ? Math.round((totalCompleted / totalLectures) * 100) : 0;

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return '#10b981';
    if (progress >= 50) return '#3b82f6';
    if (progress >= 25) return '#f59e0b';
    return '#ef4444';
  };

  const handleExport = () => {
    const data = exportProgress();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ssc-cgl-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          importProgress(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetProgress();
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Master Dashboard</h1>
        <p className="text-slate-400">SAFAR 3.0 - Your SSC CGL 2027 Preparation Journey</p>
      </div>

      {/* Overall Progress with Circular Ring */}
      <div className="glass-card rounded-2xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <CircularProgress progress={overallProgress} size={160} strokeWidth={12} color={getProgressColor(overallProgress)}>
              <div className="text-center">
                <p className="text-4xl font-bold text-white">{overallProgress}%</p>
                <p className="text-xs text-slate-400">Complete</p>
              </div>
            </CircularProgress>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-2">Total Syllabus Completion</h2>
            <p className="text-slate-400 text-sm mb-4">Across all subjects</p>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-2xl font-bold text-white">{totalCompleted}</p>
                <p className="text-xs text-slate-400">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalLectures}</p>
                <p className="text-xs text-slate-400">Total Lectures</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalLectures - totalCompleted}</p>
                <p className="text-xs text-slate-400">Remaining</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Progress Grid with Circular Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjectsData.map((subject) => {
          const progress = calculateSubjectProgress(subject.id);
          const completedLectures = Math.round((progress / 100) * subject.totalLectures);
          const color = getProgressColor(progress);
          
          return (
            <div
              key={subject.id}
              className={`glass-card rounded-xl p-5 hover:scale-[1.02] transition-transform duration-200 ${subject.glowClass}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{subject.name}</h3>
                  <p className="text-xs text-slate-400">{subject.faculty}</p>
                </div>
                <CircularProgress progress={progress} size={60} strokeWidth={6} color={color}>
                  <span className="text-xs font-bold text-white">{progress}%</span>
                </CircularProgress>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-500">
                  {completedLectures}/{subject.totalLectures} lectures completed
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap and Pomodoro Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Heatmap />
        <Pomodoro />
      </div>

      {/* Data Management */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            <Download size={18} />
            Export Progress
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
          >
            <Upload size={18} />
            Import Progress
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Reset All Progress
          </button>
        </div>
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
