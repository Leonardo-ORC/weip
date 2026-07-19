export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  organization: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthErrorInfo {
  code: string;
  message: string;
}
