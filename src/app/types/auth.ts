export interface RegisterPayload {
  username: string;
  password: string;
  role: "User" | "Admin";
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: "User" | "Admin";
}
