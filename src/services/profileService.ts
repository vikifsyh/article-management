import { Profile } from "@/app/types/profile";
import api from "@/lib/api";

export async function getProfile(token: string): Promise<Profile> {
  const res = await api.get<Profile>("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}
