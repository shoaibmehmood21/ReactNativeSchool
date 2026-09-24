import AsyncStorage from '@react-native-async-storage/async-storage';

import * as mock from './mock-data';
import type {
  Announcement,
  Child,
  Feedback,
  NewFeedback,
  Progress,
  ReportCard,
  Session,
} from './types';

/**
 * Everything the app needs from the school's backend. The app ships with an
 * in-memory mock so it runs out of the box; set EXPO_PUBLIC_API_URL to talk to
 * a real server implementing the REST contract in docs/API.md.
 */
export interface SchoolApi {
  signIn(email: string, password: string): Promise<Session>;
  getChildren(): Promise<Child[]>;
  getProgress(childId: string): Promise<Progress>;
  getReports(childId?: string): Promise<ReportCard[]>;
  getReport(id: string): Promise<ReportCard>;
  getAnnouncements(): Promise<Announcement[]>;
  listFeedback(): Promise<Feedback[]>;
  getFeedback(id: string): Promise<Feedback>;
  submitFeedback(input: NewFeedback): Promise<Feedback>;
  replyToFeedback(id: string, body: string): Promise<Feedback>;
}

export class ApiError extends Error {}

const FEEDBACK_STORAGE_KEY = 'school-connect:feedback';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const newId = (prefix: string) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function createMockApi(): SchoolApi {
  let feedbackCache: Feedback[] | null = null;

  async function loadFeedback(): Promise<Feedback[]> {
    if (feedbackCache) return feedbackCache;
    try {
      const stored = await AsyncStorage.getItem(FEEDBACK_STORAGE_KEY);
      feedbackCache = stored ? (JSON.parse(stored) as Feedback[]) : [...mock.seedFeedback];
    } catch {
      feedbackCache = [...mock.seedFeedback];
    }
    return feedbackCache;
  }

  async function saveFeedback(items: Feedback[]) {
    feedbackCache = items;
    try {
      await AsyncStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Persistence is best-effort in demo mode.
    }
  }

  return {
    async signIn(email, password) {
      await delay(500);
      if (email.trim().toLowerCase() !== mock.DEMO_EMAIL || password !== mock.DEMO_PASSWORD) {
        throw new ApiError('Invalid email or password.');
      }
      return { token: 'demo-token', parent: mock.parent, schoolName: mock.SCHOOL_NAME };
    },
    async getChildren() {
      await delay();
      return mock.children;
    },
    async getProgress(childId) {
      await delay();
      const result = mock.progress[childId];
      if (!result) throw new ApiError('Progress not found.');
      return result;
    },
    async getReports(childId) {
      await delay();
      return mock.reports
        .filter((r) => !childId || r.childId === childId)
        .sort((a, b) => b.issuedOn.localeCompare(a.issuedOn));
    },
    async getReport(id) {
      await delay();
      const report = mock.reports.find((r) => r.id === id);
      if (!report) throw new ApiError('Report not found.');
      return report;
    },
    async getAnnouncements() {
      await delay();
      return mock.announcements;
    },
    async listFeedback() {
      await delay();
      const items = await loadFeedback();
      return [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },
    async getFeedback(id) {
      await delay(150);
      const item = (await loadFeedback()).find((f) => f.id === id);
      if (!item) throw new ApiError('Feedback not found.');
      return item;
    },
    async submitFeedback(input) {
      await delay(500);
      const now = new Date().toISOString();
      const item: Feedback = {
        id: newId('f'),
        type: input.type,
        category: input.category,
        subject: input.subject,
        childId: input.childId,
        reportId: input.reportId,
        rating: input.rating,
        anonymous: input.anonymous,
        status: 'submitted',
        createdAt: now,
        updatedAt: now,
        messages: [
          {
            id: newId('m'),
            from: 'parent',
            author: input.anonymous ? 'Anonymous parent' : mock.parent.name,
            body: input.message,
            at: now,
          },
        ],
      };
      await saveFeedback([item, ...(await loadFeedback())]);
      return item;
    },
    async replyToFeedback(id, body) {
      await delay(300);
      const items = await loadFeedback();
      const existing = items.find((f) => f.id === id);
      if (!existing) throw new ApiError('Feedback not found.');
      const now = new Date().toISOString();
      const updated: Feedback = {
        ...existing,
        updatedAt: now,
        messages: [
          ...existing.messages,
          {
            id: newId('m'),
            from: 'parent',
            author: existing.anonymous ? 'Anonymous parent' : mock.parent.name,
            body,
            at: now,
          },
        ],
      };
      await saveFeedback(items.map((f) => (f.id === id ? updated : f)));
      return updated;
    },
  };
}

function createHttpApi(baseUrl: string): SchoolApi {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...init?.headers,
      },
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new ApiError(text || `Request failed (${response.status}).`);
    }
    return (await response.json()) as T;
  }

  const post = <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) });

  return {
    signIn: (email, password) => post('/auth/sign-in', { email, password }),
    getChildren: () => request('/children'),
    getProgress: (childId) => request(`/children/${childId}/progress`),
    getReports: (childId) => request(childId ? `/reports?childId=${childId}` : '/reports'),
    getReport: (id) => request(`/reports/${id}`),
    getAnnouncements: () => request('/announcements'),
    listFeedback: () => request('/feedback'),
    getFeedback: (id) => request(`/feedback/${id}`),
    submitFeedback: (input) => post('/feedback', input),
    replyToFeedback: (id, body) => post(`/feedback/${id}/messages`, { body }),
  };
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

export const isDemoMode = !baseUrl;

export const api: SchoolApi = baseUrl ? createHttpApi(baseUrl.replace(/\/$/, '')) : createMockApi();
