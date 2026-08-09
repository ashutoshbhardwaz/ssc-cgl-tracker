import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LectureProgress {
  lectureWatched: boolean;
  practiceDone: boolean;
  pyqDone: boolean;
  revisionDone: boolean;
  completedAt: string | null; // ISO timestamp when lecture was 100% complete
  lastRevisionAt: string | null; // ISO timestamp of last revision
}

export interface SubjectProgress {
  [lectureId: number]: LectureProgress;
}

export interface StudyState {
  subjects: {
    [subjectId: string]: SubjectProgress;
  };
  totalStudyMinutes: number;
  cyclesCompleted: number;
  currentXP: number;
  updateLecture: (subjectId: string, lectureId: number, updates: Partial<LectureProgress>) => void;
  markRevisionComplete: (subjectId: string, lectureId: number) => void;
  addStudyMinutes: (minutes: number) => void;
  completeCycle: () => void;
  addXP: (xp: number) => void;
  exportProgress: () => string;
  importProgress: (jsonData: string) => void;
  resetProgress: () => void;
}

const initialState = {
  subjects: {},
  totalStudyMinutes: 0,
  cyclesCompleted: 0,
  currentXP: 0,
};

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateLecture: (subjectId: string, lectureId: number, updates: Partial<LectureProgress>) => {
        set((state) => {
          const currentSubjectProgress = state.subjects[subjectId] || {};
          const currentLectureProgress = currentSubjectProgress[lectureId] || {
            lectureWatched: false,
            practiceDone: false,
            pyqDone: false,
            revisionDone: false,
            completedAt: null,
            lastRevisionAt: null,
          };

          const updatedLectureProgress = {
            ...currentLectureProgress,
            ...updates,
          };

          // Check if lecture is now 100% complete
          const isComplete = 
            updatedLectureProgress.lectureWatched &&
            updatedLectureProgress.practiceDone &&
            updatedLectureProgress.pyqDone &&
            updatedLectureProgress.revisionDone;

          // Set completedAt timestamp if just became complete
          if (isComplete && !currentLectureProgress.completedAt) {
            updatedLectureProgress.completedAt = new Date().toISOString();
          }

          // Reset completedAt if no longer complete
          if (!isComplete && currentLectureProgress.completedAt) {
            updatedLectureProgress.completedAt = null;
          }

          return {
            subjects: {
              ...state.subjects,
              [subjectId]: {
                ...currentSubjectProgress,
                [lectureId]: updatedLectureProgress,
              },
            },
          };
        });
      },

      markRevisionComplete: (subjectId: string, lectureId: number) => {
        set((state) => {
          const currentSubjectProgress = state.subjects[subjectId] || {};
          const currentLectureProgress = currentSubjectProgress[lectureId];

          if (!currentLectureProgress) return state;

          return {
            subjects: {
              ...state.subjects,
              [subjectId]: {
                ...currentSubjectProgress,
                [lectureId]: {
                  ...currentLectureProgress,
                  lastRevisionAt: new Date().toISOString(),
                },
              },
            },
          };
        });
      },

      exportProgress: () => {
        const state = get();
        return JSON.stringify(state.subjects, null, 2);
      },

      importProgress: (jsonData: string) => {
        try {
          const parsedData = JSON.parse(jsonData);
          set({ subjects: parsedData });
        } catch (error) {
          console.error('Failed to import progress:', error);
          throw new Error('Invalid JSON data');
        }
      },

      addStudyMinutes: (minutes: number) => {
        set((state) => ({
          totalStudyMinutes: state.totalStudyMinutes + minutes,
        }));
      },

      completeCycle: () => {
        set((state) => ({
          cyclesCompleted: state.cyclesCompleted + 1,
        }));
      },

      addXP: (xp: number) => {
        set((state) => ({
          currentXP: state.currentXP + xp,
        }));
      },

      resetProgress: () => {
        set(initialState);
      },
    }),
    {
      name: 'ssc-cgl-progress-storage',
    }
  )
);
