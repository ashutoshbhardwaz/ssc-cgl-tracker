export interface Lecture {
  id: number;
  lectureNumber: number;
  chapter: string;
  subTopic: string;
  lectureWatched: boolean;
  practiceDone: boolean;
  pyqDone: boolean;
  revisionDone: boolean;
}

export interface Subject {
  id: string;
  name: string;
  faculty: string;
  totalLectures: number;
  color: string;
  glowClass: string;
  lectures: Lecture[];
}

export const generateMockLectures = (count: number, subjectName: string): Lecture[] => {
  const chapters: Record<string, string[]> = {
    'Maths Advance': [
      'Algebra', 'Geometry', 'Mensuration', 'Trigonometry', 'Coordinate Geometry',
      'Number System', 'Percentage', 'Profit & Loss', 'Time & Work', 'Ratio'
    ],
    'Maths Arithmetic': [
      'Percentage', 'Profit & Loss', 'Simple Interest', 'Compound Interest',
      'Time & Work', 'Time & Distance', 'Ratio & Proportion', 'Average', 'Mixture'
    ],
    'English Grammar': [
      'Noun', 'Pronoun', 'Verb', 'Adjective', 'Adverb', 'Tenses',
      'Voice', 'Narration', 'Articles', 'Preposition'
    ],
    'Reasoning': [
      'Analogy', 'Classification', 'Series', 'Coding-Decoding', 'Blood Relations',
      'Direction Sense', 'Syllogism', 'Venn Diagrams', 'Puzzles'
    ],
    'History': [
      'Indus Valley', 'Vedic Period', 'Mauryan Empire', 'Gupta Empire',
      'Medieval India', 'Mughal Empire', 'British Rule', 'Freedom Movement'
    ],
    'Economics': [
      'Basic Concepts', 'National Income', 'Money & Banking', 'Inflation',
      'Fiscal Policy', 'Monetary Policy', 'International Trade'
    ],
    'Geography': [
      'Physical Geography', 'Climatology', 'Oceanography', 'Human Geography',
      'Indian Geography', 'World Geography', 'Maps & Diagrams'
    ],
    'Polity': [
      'Constitution', 'Fundamental Rights', 'Directive Principles', 'President',
      'Parliament', 'Prime Minister', 'Judiciary', 'Federalism'
    ],
    'Science': [
      'Physics', 'Chemistry', 'Biology', 'Scientific Instruments',
      'Technology', 'Space Science', 'Environment'
    ],
    'Static GK': [
      'Books & Authors', 'Awards & Honours', 'Sports', 'Important Days',
      'Abbreviations', 'Capitals & Currencies', 'National Symbols'
    ],
    'Computer': [
      'Basics', 'Hardware', 'Software', 'Internet', 'MS Office',
      'Programming', 'Networking', 'Security'
    ]
  };

  const subjectChapters = chapters[subjectName] || ['General'];
  const lectures: Lecture[] = [];

  for (let i = 1; i <= count; i++) {
    const chapterIndex = Math.floor((i - 1) / Math.ceil(count / subjectChapters.length));
    const chapter = subjectChapters[Math.min(chapterIndex, subjectChapters.length - 1)];
    const subTopicNum = ((i - 1) % Math.ceil(count / subjectChapters.length)) + 1;
    
    lectures.push({
      id: i,
      lectureNumber: i,
      chapter: chapter,
      subTopic: `${chapter} - Part ${subTopicNum}`,
      lectureWatched: false,
      practiceDone: false,
      pyqDone: false,
      revisionDone: false,
    });
  }

  return lectures;
};

export const subjectsData: Subject[] = [
  {
    id: 'maths-advance',
    name: 'Maths Advance',
    faculty: 'Shubham Sir',
    totalLectures: 97,
    color: 'blue',
    glowClass: 'glow-blue',
    lectures: generateMockLectures(97, 'Maths Advance'),
  },
  {
    id: 'maths-arithmetic',
    name: 'Maths Arithmetic',
    faculty: 'Ravinder Sir',
    totalLectures: 77,
    color: 'emerald',
    glowClass: 'glow-emerald',
    lectures: generateMockLectures(77, 'Maths Arithmetic'),
  },
  {
    id: 'english-grammar',
    name: 'English Grammar',
    faculty: 'Vivek Tripathi Sir',
    totalLectures: 80,
    color: 'purple',
    glowClass: 'glow-purple',
    lectures: generateMockLectures(80, 'English Grammar'),
  },
  {
    id: 'reasoning',
    name: 'Reasoning',
    faculty: 'Jitin Sagar Sir',
    totalLectures: 72,
    color: 'orange',
    glowClass: 'glow-orange',
    lectures: generateMockLectures(72, 'Reasoning'),
  },
  {
    id: 'history',
    name: 'History',
    faculty: 'Aditya Kushwaha Sir',
    totalLectures: 73,
    color: 'pink',
    glowClass: 'glow-pink',
    lectures: generateMockLectures(73, 'History'),
  },
  {
    id: 'economics',
    name: 'Economics',
    faculty: 'Akshay Mudgal Sir',
    totalLectures: 45,
    color: 'cyan',
    glowClass: 'glow-cyan',
    lectures: generateMockLectures(45, 'Economics'),
  },
  {
    id: 'geography',
    name: 'Geography',
    faculty: 'Akshay Mudgal Sir',
    totalLectures: 47,
    color: 'yellow',
    glowClass: 'glow-yellow',
    lectures: generateMockLectures(47, 'Geography'),
  },
  {
    id: 'polity',
    name: 'Polity',
    faculty: 'Bhagyashree Ma\'am',
    totalLectures: 27,
    color: 'red',
    glowClass: 'glow-red',
    lectures: generateMockLectures(27, 'Polity'),
  },
  {
    id: 'science',
    name: 'Science',
    faculty: 'Muskan Ma\'am',
    totalLectures: 73,
    color: 'indigo',
    glowClass: 'glow-indigo',
    lectures: generateMockLectures(73, 'Science'),
  },
  {
    id: 'static-gk',
    name: 'Static GK',
    faculty: 'Raja Gupta Sir',
    totalLectures: 35,
    color: 'teal',
    glowClass: 'glow-teal',
    lectures: generateMockLectures(35, 'Static GK'),
  },
  {
    id: 'computer',
    name: 'Computer',
    faculty: 'Bhagyashree Ma\'am',
    totalLectures: 13,
    color: 'lime',
    glowClass: 'glow-lime',
    lectures: generateMockLectures(13, 'Computer'),
  },
];

export const phases = [
  { id: 1, name: 'Foundation', description: 'Build strong basics', duration: 'Months 1-3' },
  { id: 2, name: 'Revision', description: 'Deep dive & practice', duration: 'Months 4-6' },
  { id: 3, name: 'Speed', description: 'Increase solving speed', duration: 'Months 7-9' },
  { id: 4, name: 'Mocks', description: 'Full test practice', duration: 'Months 10-12' },
];

export const dailyRoutine = [
  { id: 1, step: 'Fix Sleep Cycle', icon: 'moon', time: '10:00 PM - 6:00 AM' },
  { id: 2, step: 'Daily Class', icon: 'play-circle', time: 'As per schedule' },
  { id: 3, step: 'Class Notes Revision', icon: 'book-open', time: 'Post class' },
  { id: 4, step: 'Practice Sheet', icon: 'pen-tool', time: 'Evening' },
  { id: 5, step: 'PYQs', icon: 'target', time: 'Before sleep' },
];
