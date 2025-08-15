"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schema/authSchema";
import { loginUser } from "@/services/authService";
import { LoginPayload } from "@/app/types/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginPayload) => {
    try {
      // Panggil API login
      await loginUser(data);
      toast.success("Login berhasil!");

      // Login session NextAuth
      await signIn("credentials", {
        redirect: false,
        username: data.username,
        password: data.password,
      });

      router.push("/admin");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login gagal");
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Username"
            {...register("username")}
            className="border w-full p-2 rounded"
          />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="border w-full p-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          {isSubmitting ? "Loading..." : "Login"}
        </button>
      </form>
    </main>
  );
}
