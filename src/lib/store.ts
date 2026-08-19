import { WHEEL_DIMENSIONS } from "./assessmentData";

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  year: string; // "1st", "2nd", "3rd", "4th"
  assessmentType: "PRE" | "POST";
  collegeName: string;
  createdAt: string;
}

export interface StudentAssessmentState {
  psychometricCompleted: boolean;
  psychometricScore: number;
  psychometricAttemptId?: string;
  aptitudeCompleted: boolean;
  aptitudeScore: number;
  aptitudeAttemptId?: string;
  wheelCompleted: boolean;
  wheelAverage: number;
  wheelScores: Record<string, number>;
}

// In-memory global store to guarantee flawless operation across hot reloads & server runs
const defaultWheelScores: Record<string, number> = {};
WHEEL_DIMENSIONS.forEach((dim) => {
  defaultWheelScores[dim.id] = Math.round(dim.benchmark);
});

const globalStore = global as unknown as {
  _studentProfiles?: Map<string, StudentProfile>;
  _assessmentStates?: Map<string, StudentAssessmentState>;
};

if (!globalStore._studentProfiles) {
  globalStore._studentProfiles = new Map();
}

if (!globalStore._assessmentStates) {
  globalStore._assessmentStates = new Map();
}

export const inMemoryStore = {
  saveProfile(profile: StudentProfile) {
    globalStore._studentProfiles?.set(profile.id, profile);
    globalStore._studentProfiles?.set(profile.email, profile);
    if (!globalStore._assessmentStates?.has(profile.id)) {
      globalStore._assessmentStates?.set(profile.id, {
        psychometricCompleted: false,
        psychometricScore: 0,
        aptitudeCompleted: false,
        aptitudeScore: 0,
        wheelCompleted: false,
        wheelAverage: 0,
        wheelScores: { ...defaultWheelScores },
      });
    }
  },

  getProfile(idOrEmail: string): StudentProfile | undefined {
    return globalStore._studentProfiles?.get(idOrEmail);
  },

  getAllProfiles(): StudentProfile[] {
    const list: StudentProfile[] = [];
    const seenIds = new Set<string>();
    globalStore._studentProfiles?.forEach((profile) => {
      if (!seenIds.has(profile.id)) {
        seenIds.add(profile.id);
        list.push(profile);
      }
    });
    return list;
  },

  getState(studentId: string): StudentAssessmentState {
    const existing = globalStore._assessmentStates?.get(studentId);
    if (existing) return existing;

    const initial: StudentAssessmentState = {
      psychometricCompleted: false,
      psychometricScore: 0,
      aptitudeCompleted: false,
      aptitudeScore: 0,
      wheelCompleted: false,
      wheelAverage: 0,
      wheelScores: { ...defaultWheelScores },
    };
    globalStore._assessmentStates?.set(studentId, initial);
    return initial;
  },

  updateState(studentId: string, updates: Partial<StudentAssessmentState>) {
    const current = this.getState(studentId);
    const updated = { ...current, ...updates };
    globalStore._assessmentStates?.set(studentId, updated);
    return updated;
  },
};
