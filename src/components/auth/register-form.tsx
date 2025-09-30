"use client";
import z from "zod";
import { Input } from "../ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z
      .string()
      .email("Please enter a valid email")
      .min(1, "Email is required"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .nonempty("Confirm Password is required")
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type RegisterFormValues = z.infer<typeof registerSchema>;
export function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const name = watch("name");
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const handleRegisterSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      const result = await res.json();
      console.log(" Registered:", result);
      if (!res.ok) {
        throw new Error("Failed to register");
      }else{
        toast.success("Registration successful");
        router.push("/login");
      }
      
    } catch (error) {
      console.log(error, "Registration failed");
      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleRegisterSubmit)} className="space-y-6">
      <div className="space-y-2 relative">
        {name === "" && (
          <User
            className={`absolute top-8 left-3 w-4.5 h-4.5 text-gray-400  pointer-events-none`}
          />
        )}
        <Label htmlFor="title">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Name"
          {...register("name")}
          className={name === "" ? "pl-10" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-700">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2 relative">
        {email === "" && (
          <Mail
            className={`absolute top-8 left-3 w-4.5 h-4.5 text-gray-400  pointer-events-none`}
          />
        )}
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          {...register("email")}
          className={email === "" ? "pl-10" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-700">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2 relative">
        {password === "" && (
          <Lock
            className={`absolute top-8 left-3 w-4.5 h-4.5 text-gray-400 pointer-events-none`}
          />
        )}
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          {...register("password")}
          className={password === "" ? "pl-10 pr-10" : ""}
        />
        {errors.password && (
          <p className="text-sm text-red-700">{errors.password.message}</p>
        )}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-8 right-3 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? (
            <EyeOff className="w-4.5 h-4.5" />
          ) : (
            <Eye className="w-4.5 h-4.5" />
          )}
        </button>
      </div>
      <div className="space-y-2 relative">
        {confirmPassword === "" && (
          <Lock
            className={`absolute top-8 left-3 w-4.5 h-4.5 text-gray-400 pointer-events-none`}
          />
        )}
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          {...register("confirmPassword")}
          className={confirmPassword === "" ? "pl-10 pr-10" : ""}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-700">
            {errors.confirmPassword.message}
          </p>
        )}
        <button
          type="button"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          className="absolute top-8 right-3 text-gray-500 hover:text-gray-700"
        >
          {showConfirmPassword ? (
            <EyeOff className="w-4.5 h-4.5" />
          ) : (
            <Eye className="w-4.5 h-4.5" />
          )}
        </button>
      </div>
      <div className="flex items-center justify-center">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 bg-teal-500 w-2/3 hover:bg-teal-700 transition-all duration-300"
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
      </div>
    </form>
  );
}

export default Register;
