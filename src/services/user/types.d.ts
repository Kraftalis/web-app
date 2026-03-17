// ─── User profile ───────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  status: string;
  emailVerified: string | null;
  createdAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  image?: string | null;
}
