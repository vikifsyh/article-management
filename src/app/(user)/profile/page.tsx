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
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white px-4 py-6 rounded-xl w-full max-w-md text-center">
        <h1 className="text-xl font-semibold">User Profile</h1>
        {profile ? (
          <div className="mt-9">
            {/* Avatar dengan huruf pertama */}
            <div className="flex justify-center mb-6">
              <div className="w-[68px] h-[68px] rounded-full bg-blue-200 flex items-center justify-center text-xl font-semibold text-blue-900">
                {getInitial(profile.username)}
              </div>
            </div>

            {/* Detail profil */}
            <div className="space-y-3">
              <div className="grid grid-cols-[100px_20px_auto] items-center bg-slate-200 px-4 py-2 rounded-lg">
                <span className="font-semibold text-left">Username</span>
                <span className="font-semibold">:</span>
                <span className="font-normal">{profile.username}</span>
              </div>
              <div className="grid grid-cols-[100px_20px_auto] items-center bg-slate-200 px-4 py-2 rounded-lg">
                <span className="text-left font-semibold">Role</span>
                <span className="font-semibold">:</span>
                <span className="font-normal">{profile.role}</span>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="w-full mt-6 bg-primary text-white text-sm font-medium py-[10px] rounded-md hover:bg-primary-700 transition"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Mengambil data profil...</p>
        )}
      </div>
    </div>
  );
}
