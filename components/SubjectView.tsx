'use client';

import { Subject, Lecture } from '@/lib/data';
import { Check, CheckCircle, BookOpen, User, TrendingUp } from 'lucide-react';

interface SubjectViewProps {
  subject: Subject;
  onLectureUpdate: (lectureId: number, updates: Partial<Lecture>) => void;
}

export default function SubjectView({ subject, onLectureUpdate }: SubjectViewProps) {
  const completedLectures = subject.lectures.filter(
    (lecture) =>
      lecture.lectureWatched &&
      lecture.practiceDone &&
      lecture.pyqDone &&
      lecture.revisionDone
  ).length;

  const progress = Math.round((completedLectures / subject.totalLectures) * 100);

  const isLectureComplete = (lecture: Lecture) => {
    return lecture.lectureWatched && lecture.practiceDone && lecture.pyqDone && lecture.revisionDone;
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
              {subject.lectures.map((lecture) => (
                <tr
                  key={lecture.id}
                  className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                    isLectureComplete(lecture) ? 'bg-emerald-500/5' : ''
                  }`}
                >
                  <td className="p-4">
                    <span className="text-white font-medium">#{lecture.lectureNumber}</span>
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
                        onLectureUpdate(lecture.id, { lectureWatched: !lecture.lectureWatched })
                      }
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        lecture.lectureWatched
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-slate-600 hover:border-blue-500'
                      }`}
                    >
                      {lecture.lectureWatched && <Check size={14} className="text-white" />}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        onLectureUpdate(lecture.id, { practiceDone: !lecture.practiceDone })
                      }
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        lecture.practiceDone
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-slate-600 hover:border-emerald-500'
                      }`}
                    >
                      {lecture.practiceDone && <Check size={14} className="text-white" />}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => onLectureUpdate(lecture.id, { pyqDone: !lecture.pyqDone })}
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        lecture.pyqDone
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-slate-600 hover:border-purple-500'
                      }`}
                    >
                      {lecture.pyqDone && <Check size={14} className="text-white" />}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        onLectureUpdate(lecture.id, { revisionDone: !lecture.revisionDone })
                      }
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        lecture.revisionDone
                          ? 'bg-orange-500 border-orange-500'
                          : 'border-slate-600 hover:border-orange-500'
                      }`}
                    >
                      {lecture.revisionDone && <Check size={14} className="text-white" />}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    {isLectureComplete(lecture) ? (
                      <div className="flex items-center justify-center gap-1 text-emerald-400">
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-sm">In Progress</span>
                    )}
                  </td>
                </tr>
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
