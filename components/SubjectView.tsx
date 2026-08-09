'use client';

import { Subject, Lecture } from '@/lib/data';
import { Check, CheckCircle, BookOpen, User, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStudyStore } from '@/lib/store';
import { differenceInDays, parseISO } from 'date-fns';

interface SubjectViewProps {
  subject: Subject;
}

export default function SubjectView({ subject }: SubjectViewProps) {
  const { subjects, updateLecture, markRevisionComplete } = useStudyStore();
  const subjectProgress = subjects[subject.id] || {};

  const completedLectures = subject.lectures.filter((lecture) => {
    const progress = subjectProgress[lecture.id];
    return progress &&
      progress.lectureWatched &&
      progress.practiceDone &&
      progress.pyqDone &&
      progress.revisionDone;
  }).length;

  const progress = Math.round((completedLectures / subject.totalLectures) * 100);

  const isLectureComplete = (lectureId: number) => {
    const progress = subjectProgress[lectureId];
    return progress &&
      progress.lectureWatched &&
      progress.practiceDone &&
      progress.pyqDone &&
      progress.revisionDone;
  };

  const isDueForRevision = (lectureId: number) => {
    const progress = subjectProgress[lectureId];
    if (!progress || !progress.completedAt) return false;
    
    const daysSinceCompletion = differenceInDays(new Date(), parseISO(progress.completedAt));
    return daysSinceCompletion > 7;
  };

  const handleLectureUpdate = (lectureId: number, field: string, value: boolean) => {
    updateLecture(subject.id, lectureId, { [field]: value });
  };

  const handleRevisionComplete = (lectureId: number) => {
    markRevisionComplete(subject.id, lectureId);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className={`glass-card rounded-2xl p-6 lg:p-8 ${subject.glowClass}`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{subject.name}</h1>
            <div className="flex items-center gap-2 text-slate-400">
              <User size={18} />
              <span>{subject.faculty}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-2">
              <TrendingUp className={`text-${subject.color}-400`} size={20} />
              <span className="text-3xl font-bold text-white">{progress}%</span>
            </div>
            <p className="text-slate-400 text-sm">
              {completedLectures}/{subject.totalLectures} lectures completed
            </p>
          </div>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-${subject.color}-500 to-${subject.color}-600 transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Lectures Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left p-4 text-slate-400 font-medium text-sm">Lecture</th>
                <th className="text-left p-4 text-slate-400 font-medium text-sm">Chapter</th>
                <th className="text-left p-4 text-slate-400 font-medium text-sm">Sub-Topic</th>
                <th className="text-center p-4 text-slate-400 font-medium text-sm">Watched</th>
                <th className="text-center p-4 text-slate-400 font-medium text-sm">Practice</th>
                <th className="text-center p-4 text-slate-400 font-medium text-sm">PYQs</th>
                <th className="text-center p-4 text-slate-400 font-medium text-sm">Revision</th>
                <th className="text-center p-4 text-slate-400 font-medium text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {subject.lectures.map((lecture, index) => (
                <motion.tr
                  key={lecture.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                    isLectureComplete(lecture.id) ? 'bg-emerald-500/5' : ''
                  } ${
                    isDueForRevision(lecture.id) ? 'bg-orange-500/10' : ''
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">#{lecture.lectureNumber}</span>
                      {isDueForRevision(lecture.id) && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                          <AlertCircle size={12} />
                          Due for Revision
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-300">{lecture.chapter}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-400 text-sm">{lecture.subTopic}</span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        handleLectureUpdate(lecture.id, 'lectureWatched', !subjectProgress[lecture.id]?.lectureWatched)
                      }
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        subjectProgress[lecture.id]?.lectureWatched
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-slate-600 hover:border-blue-500'
                      }`}
                    >
                      {subjectProgress[lecture.id]?.lectureWatched && <Check size={14} className="text-white" />}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        handleLectureUpdate(lecture.id, 'practiceDone', !subjectProgress[lecture.id]?.practiceDone)
                      }
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        subjectProgress[lecture.id]?.practiceDone
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-slate-600 hover:border-emerald-500'
                      }`}
                    >
                      {subjectProgress[lecture.id]?.practiceDone && <Check size={14} className="text-white" />}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        handleLectureUpdate(lecture.id, 'pyqDone', !subjectProgress[lecture.id]?.pyqDone)
                      }
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        subjectProgress[lecture.id]?.pyqDone
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-slate-600 hover:border-purple-500'
                      }`}
                    >
                      {subjectProgress[lecture.id]?.pyqDone && <Check size={14} className="text-white" />}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        handleLectureUpdate(lecture.id, 'revisionDone', !subjectProgress[lecture.id]?.revisionDone)
                      }
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        subjectProgress[lecture.id]?.revisionDone
                          ? 'bg-orange-500 border-orange-500'
                          : 'border-slate-600 hover:border-orange-500'
                      }`}
                    >
                      {subjectProgress[lecture.id]?.revisionDone && <Check size={14} className="text-white" />}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    {isLectureComplete(lecture.id) ? (
                      <div className="flex items-center justify-center gap-2">
                        {isDueForRevision(lecture.id) ? (
                          <button
                            onClick={() => handleRevisionComplete(lecture.id)}
                            className="flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors"
                            title="Mark revision as complete"
                          >
                            <RefreshCw size={16} />
                            <span className="text-sm font-medium">Revise Now</span>
                          </button>
                        ) : (
                          <div className="flex items-center justify-center gap-1 text-emerald-400">
                            <CheckCircle size={16} />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500 text-sm">In Progress</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-500" />
            <span>Lecture Watched</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-emerald-500 bg-emerald-500" />
            <span>Practice Done</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-purple-500 bg-purple-500" />
            <span>PYQs Done</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-orange-500 bg-orange-500" />
            <span>Revision Done</span>
          </div>
        </div>
      </div>
    </div>
  );
}
