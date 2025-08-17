"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getProfile } from "@/services/profileService";
import { Profile } from "@/app/types/profile";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (session?.user?.token) {
      getProfile(session.user.token)
        .then((data) => setProfile(data))
        .catch((err) => console.error(err));
    }
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Silakan login dulu.</p>;

  const getInitial = (name?: string) =>
    name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Profil</h1>
      {profile ? (
        <div className="mt-4 space-y-4">
          {/* Avatar dengan huruf pertama */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold shadow">
              {getInitial(profile.username)}
            </div>
            <div>
              <p className="text-lg font-semibold">{profile.username}</p>
              <p className="text-sm text-gray-500">{profile.role}</p>
            </div>
          </div>

          {/* Detail profil */}
          <div className="space-y-2">
            <p>
              <strong>ID:</strong> {profile.id}
            </p>
            <p>
              <strong>Role:</strong> {profile.role}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(profile.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        <p>Mengambil data profil...</p>
      )}
    </div>
  );
}
