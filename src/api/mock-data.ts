import type { Announcement, Child, Feedback, Parent, Progress, ReportCard } from './types';

export const DEMO_EMAIL = 'parent@demo.school';
export const DEMO_PASSWORD = 'demo123';
export const SCHOOL_NAME = 'Greenfield Public School';

export const parent: Parent = {
  id: 'p1',
  name: 'Ayesha Khan',
  email: DEMO_EMAIL,
  phone: '+92 300 1234567',
};

export const children: Child[] = [
  {
    id: 'c1',
    name: 'Ali Khan',
    className: 'Grade 5 – B',
    rollNo: '5B-14',
    classTeacher: 'Ms. Sara Ahmed',
    avatarColor: '#2563EB',
  },
  {
    id: 'c2',
    name: 'Fatima Khan',
    className: 'Grade 2 – A',
    rollNo: '2A-07',
    classTeacher: 'Mr. Usman Tariq',
    avatarColor: '#DB2777',
  },
];

export const progress: Record<string, Progress> = {
  c1: {
    childId: 'c1',
    term: 'Term 1, 2026–27',
    overallPercent: 84,
    attendance: { totalDays: 62, present: 58, absent: 3, late: 1 },
    subjects: [
      { subject: 'Mathematics', teacher: 'Mr. Bilal', score: 91, grade: 'A+', trend: 'up', remarks: 'Excellent problem solving.' },
      { subject: 'English', teacher: 'Ms. Sara Ahmed', score: 82, grade: 'A', trend: 'steady', remarks: 'Good reader; work on spelling.' },
      { subject: 'Science', teacher: 'Ms. Hina', score: 88, grade: 'A', trend: 'up', remarks: 'Curious and engaged in labs.' },
      { subject: 'Urdu', teacher: 'Mr. Kamran', score: 74, grade: 'B', trend: 'down', remarks: 'Needs more practice in writing.' },
      { subject: 'Social Studies', teacher: 'Ms. Nida', score: 85, grade: 'A', trend: 'steady', remarks: 'Participates well in class.' },
    ],
    upcoming: [
      { id: 'a1', subject: 'Mathematics', title: 'Fractions quiz', date: '2026-10-02' },
      { id: 'a2', subject: 'Science', title: 'Plant life project due', date: '2026-10-09' },
    ],
  },
  c2: {
    childId: 'c2',
    term: 'Term 1, 2026–27',
    overallPercent: 90,
    attendance: { totalDays: 62, present: 60, absent: 2, late: 0 },
    subjects: [
      { subject: 'Mathematics', teacher: 'Ms. Amna', score: 93, grade: 'A+', trend: 'up', remarks: 'Very quick with numbers.' },
      { subject: 'English', teacher: 'Mr. Usman Tariq', score: 89, grade: 'A', trend: 'up', remarks: 'Lovely handwriting.' },
      { subject: 'General Knowledge', teacher: 'Ms. Rabia', score: 87, grade: 'A', trend: 'steady', remarks: 'Asks thoughtful questions.' },
      { subject: 'Urdu', teacher: 'Mr. Kamran', score: 90, grade: 'A+', trend: 'steady', remarks: 'Reads fluently.' },
    ],
    upcoming: [{ id: 'a3', subject: 'English', title: 'Spelling bee', date: '2026-10-05' }],
  },
};

export const reports: ReportCard[] = [
  {
    id: 'r1',
    childId: 'c1',
    term: 'Final Term, 2025–26',
    issuedOn: '2026-06-20',
    overallGrade: 'A',
    overallPercent: 83,
    classPosition: '6th of 32',
    teacherRemarks: 'Ali is a hardworking student with strong analytical skills. Encourage daily reading at home.',
    principalRemarks: 'Promoted to Grade 5. Keep up the good work!',
    subjects: [
      { subject: 'Mathematics', marks: 89, maxMarks: 100, grade: 'A' },
      { subject: 'English', marks: 80, maxMarks: 100, grade: 'A' },
      { subject: 'Science', marks: 86, maxMarks: 100, grade: 'A' },
      { subject: 'Urdu', marks: 76, maxMarks: 100, grade: 'B' },
      { subject: 'Social Studies', marks: 84, maxMarks: 100, grade: 'A' },
    ],
  },
  {
    id: 'r2',
    childId: 'c1',
    term: 'Mid Term, 2025–26',
    issuedOn: '2026-01-15',
    overallGrade: 'B+',
    overallPercent: 79,
    classPosition: '9th of 32',
    teacherRemarks: 'Good progress. Needs to focus on completing homework on time.',
    principalRemarks: 'Satisfactory.',
    subjects: [
      { subject: 'Mathematics', marks: 84, maxMarks: 100, grade: 'A' },
      { subject: 'English', marks: 77, maxMarks: 100, grade: 'B+' },
      { subject: 'Science', marks: 81, maxMarks: 100, grade: 'A' },
      { subject: 'Urdu', marks: 72, maxMarks: 100, grade: 'B' },
      { subject: 'Social Studies', marks: 80, maxMarks: 100, grade: 'A' },
    ],
  },
  {
    id: 'r3',
    childId: 'c2',
    term: 'Final Term, 2025–26',
    issuedOn: '2026-06-20',
    overallGrade: 'A+',
    overallPercent: 91,
    classPosition: '2nd of 28',
    teacherRemarks: 'Fatima is a delight in class — confident, kind and eager to learn.',
    principalRemarks: 'Promoted to Grade 2 with distinction.',
    subjects: [
      { subject: 'Mathematics', marks: 94, maxMarks: 100, grade: 'A+' },
      { subject: 'English', marks: 90, maxMarks: 100, grade: 'A+' },
      { subject: 'General Knowledge', marks: 88, maxMarks: 100, grade: 'A' },
      { subject: 'Urdu', marks: 92, maxMarks: 100, grade: 'A+' },
    ],
  },
];

export const announcements: Announcement[] = [
  {
    id: 'n1',
    title: 'Parent–Teacher Meeting',
    body: 'PTM for all classes will be held on Saturday, 4 October from 9:00 AM to 12:00 PM. Please book your slot with the class teacher.',
    date: '2026-09-22',
    category: 'event',
  },
  {
    id: 'n2',
    title: 'Mid-term exam schedule released',
    body: 'Mid-term exams begin on 20 October. The detailed date sheet has been shared with students.',
    date: '2026-09-18',
    category: 'exam',
  },
  {
    id: 'n3',
    title: 'School closed for public holiday',
    body: 'The school will remain closed on Monday, 29 September.',
    date: '2026-09-15',
    category: 'holiday',
  },
];

export const seedFeedback: Feedback[] = [
  {
    id: 'f1',
    type: 'complaint',
    category: 'Transport',
    subject: 'School van arriving late',
    childId: 'c1',
    anonymous: false,
    status: 'resolved',
    createdAt: '2026-09-02T08:15:00Z',
    updatedAt: '2026-09-04T11:00:00Z',
    messages: [
      {
        id: 'm1',
        from: 'parent',
        author: 'Ayesha Khan',
        body: 'The van on Route 7 has been arriving 20–25 minutes late for the past week.',
        at: '2026-09-02T08:15:00Z',
      },
      {
        id: 'm2',
        from: 'school',
        author: 'Transport Office',
        body: 'Thank you for reporting this. The route has been re-planned and a new driver assigned from 5 September.',
        at: '2026-09-04T11:00:00Z',
      },
    ],
  },
  {
    id: 'f2',
    type: 'suggestion',
    category: 'Facilities',
    subject: 'Water coolers on the second floor',
    anonymous: false,
    status: 'in_review',
    createdAt: '2026-09-10T14:30:00Z',
    updatedAt: '2026-09-11T09:00:00Z',
    messages: [
      {
        id: 'm3',
        from: 'parent',
        author: 'Ayesha Khan',
        body: 'It would help if a water cooler were installed on the second floor near the Grade 5 classrooms.',
        at: '2026-09-10T14:30:00Z',
      },
      {
        id: 'm4',
        from: 'school',
        author: 'Admin Office',
        body: 'Great suggestion — this has been forwarded to the facilities committee.',
        at: '2026-09-11T09:00:00Z',
      },
    ],
  },
];
