import api from "@/lib/api";
import { LoginPayload, RegisterPayload, AuthResponse } from "@/app/types/auth";

export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const registerUser = async (
  data: RegisterPayload
): Promise<AuthResponse> => {
  const res = await api.post("/auth/register", data);
  return res.data;
};
