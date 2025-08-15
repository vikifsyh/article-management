"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schema/authSchema";
import { registerUser } from "@/services/authService";
import { RegisterPayload } from "@/app/types/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
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
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("username")}
          placeholder="Username"
          className="border w-full p-2 rounded"
        />
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}

        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="border w-full p-2 rounded"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <select {...register("role")} className="border w-full p-2 rounded">
          <option value="">Pilih Role</option>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        {errors.role && <p className="text-red-500">{errors.role.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isSubmitting ? "Loading..." : "Register"}
        </button>
      </form>
    </main>
  );
}
