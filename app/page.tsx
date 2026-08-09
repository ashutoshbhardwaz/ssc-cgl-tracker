'use client';

import { useState, useEffect } from 'react';
import { subjectsData, Subject, Lecture } from '@/lib/data';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import SubjectView from '@/components/SubjectView';

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>(subjectsData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('ssc-cgl-progress');
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        setSubjects(parsedProgress);
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save progress to localStorage whenever subjects change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ssc-cgl-progress', JSON.stringify(subjects));
    }
  }, [subjects, isLoaded]);

  const handleLectureUpdate = (subjectId: string, lectureId: number, updates: Partial<Lecture>) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              lectures: subject.lectures.map((lecture) =>
                lecture.id === lectureId ? { ...lecture, ...updates } : lecture
              ),
            }
          : subject
      )
    );
  };

  const selectedSubjectData = subjects.find((s) => s.id === selectedSubject);

  const calculateSubjectProgress = () => {
    const progress: Record<string, number> = {};
    subjects.forEach((subject) => {
      const completedLectures = subject.lectures.filter(
        (lecture) =>
          lecture.lectureWatched &&
          lecture.practiceDone &&
          lecture.pyqDone &&
          lecture.revisionDone
      ).length;
      progress[subject.id] = Math.round((completedLectures / subject.totalLectures) * 100);
    });
    return progress;
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex">
        <Sidebar
          selectedSubject={selectedSubject}
          onSubjectSelect={setSelectedSubject}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        <main className="flex-1 min-h-screen lg:ml-0">
          <div className="lg:ml-72">
            {selectedSubject && selectedSubjectData ? (
              <SubjectView
                subject={selectedSubjectData}
                onLectureUpdate={(lectureId, updates) =>
                  handleLectureUpdate(selectedSubject, lectureId, updates)
                }
              />
            ) : (
              <Dashboard subjectProgress={calculateSubjectProgress()} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
