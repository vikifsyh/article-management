import { z } from "zod";

export const loginSchema = z.object({
  password: z.string().min(6, { message: "Minimal 6 karakter" }),
  username: z.string().min(3, { message: "Username minimal 3 karakter" }),
});

export const registerSchema = z.object({
  username: z.string().min(3, { message: "Username minimal 3 karakter" }),
  password: z.string().min(6, { message: "Minimal 6 karakter" }),
  role: z.enum(["User", "Admin"]).refine((val) => !!val, {
    message: "Role wajib dipilih",
  }),
});
