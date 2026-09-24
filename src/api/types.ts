export type Parent = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type Session = {
  token: string;
  parent: Parent;
  schoolName: string;
};

export type Child = {
  id: string;
  name: string;
  className: string;
  rollNo: string;
  classTeacher: string;
  avatarColor: string;
};

export type Trend = 'up' | 'down' | 'steady';

export type SubjectProgress = {
  subject: string;
  teacher: string;
  score: number;
  grade: string;
  trend: Trend;
  remarks: string;
};

export type Attendance = {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
};

export type Assessment = {
  id: string;
  subject: string;
  title: string;
  date: string;
};

export type Progress = {
  childId: string;
  term: string;
  overallPercent: number;
  attendance: Attendance;
  subjects: SubjectProgress[];
  upcoming: Assessment[];
};

export type ReportSubject = {
  subject: string;
  marks: number;
  maxMarks: number;
  grade: string;
};

export type ReportCard = {
  id: string;
  childId: string;
  term: string;
  issuedOn: string;
  overallGrade: string;
  overallPercent: number;
  classPosition?: string;
  teacherRemarks: string;
  principalRemarks: string;
  subjects: ReportSubject[];
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  date: string;
  category: 'event' | 'notice' | 'holiday' | 'exam';
};

export type FeedbackType = 'complaint' | 'suggestion' | 'appreciation' | 'report';

export type FeedbackStatus = 'submitted' | 'in_review' | 'resolved' | 'closed';

export type FeedbackMessage = {
  id: string;
  from: 'parent' | 'school';
  author: string;
  body: string;
  at: string;
};

export type Feedback = {
  id: string;
  type: FeedbackType;
  category: string;
  subject: string;
  childId?: string;
  reportId?: string;
  rating?: number;
  anonymous: boolean;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
  messages: FeedbackMessage[];
};

export type NewFeedback = {
  type: FeedbackType;
  category: string;
  subject: string;
  message: string;
  childId?: string;
  reportId?: string;
  rating?: number;
  anonymous: boolean;
};
