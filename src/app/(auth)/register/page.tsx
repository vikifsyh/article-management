"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schema/authSchema";
import { registerUser } from "@/services/authService";
import { RegisterPayload } from "@/app/types/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Icon from "@/components/atom/icon";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterPayload) => {
    try {
      await registerUser(data);
      toast.success("Register sukses!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal register");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white md:bg-gray-100">
      {/* Container untuk form */}
      <div className="w-full px-6 py-[10px] lg:px-4 lg:py-10 sm:max-w-sm md:max-w-md md:bg-white rounded-xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Icon name="logo" />
        </div>
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

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Role
            </label>
            <div className="relative">
              <select
                {...register("role")}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none pr-10"
              >
                <option value="">Select Role</option>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>

              {/* Icon chevron */}
              <ChevronDown
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
              />
            </div>
            {errors.role && (
              <p className="mt-1 text-sm font-normal text-red-500">
                {errors.role.message}
              </p>
            )}
          </div>
          <div className="mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 bg-primary text-white text-sm font-medium py-[10px] rounded-md hover:bg-primary-700 transition"
            >
              {isSubmitting ? "Loading..." : "Register"}
            </button>
          </div>
        </form>

        {/* Login */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
