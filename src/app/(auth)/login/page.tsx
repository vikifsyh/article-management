"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Icon from "@/components/atom/icon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schema/authSchema";
import { loginUser } from "@/services/authService";
import { LoginPayload } from "@/app/types/auth";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-white md:bg-gray-100">
      <div className="w-full px-6 py-[10px] lg:px-4 lg:py-10 sm:max-w-sm md:max-w-md md:bg-white rounded-xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Icon name="logo" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.username && (
              <p className="mt-1 text-sm font-normal text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm font-normal text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-primary text-white text-sm font-medium py-[10px] rounded-md hover:bg-primary-700 transition"
          >
            {isSubmitting ? "Loading..." : "Login"}
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Don’t have an account?{" "}
          <Link href="/register" className="text-primary underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
