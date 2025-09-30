"use client";
import z from "zod";
import { Input } from "../ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email is required"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});
type LoginFormValues = z.infer<typeof loginSchema>;
export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const password = watch("password");
  const email = watch("email");

  const handleLoginSubmit = async(data: LoginFormValues) => {
    setIsLoading(true);

     try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok){ 
        throw new Error(result.message)
    }else{
      toast.success("Login successful");
      router.push("/");
    }


    console.log(" Login successful:", result);

    localStorage.setItem("token", result.token);

 

  } catch (error: any) {
    console.error(" Error:", error.message);
    toast.error("Login failed");
  } finally {
    setIsLoading(false);
  }

  }
  
  return (
    <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-6">
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
      <div className="flex items-center justify-center">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 bg-teal-500 w-2/3 hover:bg-teal-700 transition-all duration-300"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
}

export default Login;
