// src/data/dummySubjects.js
// Dummy subject data for use in dashboards, tables, etc.

const dummyExamTypes = [
  'Term Test',
  'Monthly Quiz',
  'Final Exam',
  'Practical',
  'Assignment',
  'Midterm',
  'Oral Test',
  'Project',
  'Class Test',
  'Mock Exam'
];

const dummySubjects = [
  {
    id: 'SUB001',
    name: 'Mathematics',
    lessons: [
      'Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics', 'Probability', 'Vectors', 'Matrices', 'Differentiation', 'Integration', 'Sequences', 'Graphs'
    ]
  },
  {
    id: 'SUB002',
    name: 'Science',
    lessons: [
      'Biology Basics', 'Photosynthesis', 'Human Body', 'Electricity', 'Magnetism', 'Chemistry of Water', 'Periodic Table', 'Acids and Bases', 'Forces', 'Energy', 'Ecology', 'Genetics'
    ]
  },
  {
    id: 'SUB003',
    name: 'Sinhala',
    lessons: [
      'Grammar', 'Essay Writing', 'Comprehension', 'Poetry', 'Short Stories', 'Drama', 'Vocabulary', 'Oral Skills', 'Letter Writing', 'Literature', 'Proverbs', 'Idioms'
    ]
  },
  {
    id: 'SUB004',
    name: 'English',
    lessons: [
      'Grammar', 'Essay Writing', 'Comprehension', 'Poetry', 'Short Stories', 'Drama', 'Vocabulary', 'Oral Skills', 'Letter Writing', 'Literature', 'Proverbs', 'Idioms'
    ]
  },
  {
    id: 'SUB005',
    name: 'IT',
    lessons: [
      'Basic Components', 'Computer History', 'Number System', 'Logic Gates', 'Operating System', 'Networking', 'System', 'Databases', 'Python', 'Web Development', 'IOT', 'E-commerce', 'New Trends'
    ]
  },
  {
    id: 'SUB006',
    name: 'History',
    lessons: [
      'Ancient Civilizations', 'Sri Lankan History', 'World Wars', 'Kings and Kingdoms', 'Colonial Era', 'Modern History', 'Revolutions', 'Cultural Heritage', 'Historical Sources', 'Archaeology', 'Famous Leaders', 'Historical Monuments'
    ]
  },
];

export { dummySubjects, dummyExamTypes };
