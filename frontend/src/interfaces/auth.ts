// Tipos e interfaces relacionados à autenticação

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'ADMIN' | 'USER';
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void | { requires2FA: boolean; sessionToken: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  request2FACode: (email: string, password: string) => Promise<{ requires2FA: boolean; sessionToken: string }>;
  verify2FA: (sessionToken: string, code: string) => Promise<void>;
}