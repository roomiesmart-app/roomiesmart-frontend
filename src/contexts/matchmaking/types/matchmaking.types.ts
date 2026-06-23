export interface CandidateHabits {
  isEarlyBird: boolean;
  hobbies: string[];
  petPreference: string;
  smokingPreference: string;
}

export interface MatchmakingCandidate {
  id: string;
  fullName: string;
  location: string;
  habits: CandidateHabits;
  budget: { min: number; max: number };
  roomType: string;
  ai_embedding: number[];
}

export interface MatchmakingResponse {
  candidate: MatchmakingCandidate;
  compatibilityScore: number;
  aiExplanation: string;
}