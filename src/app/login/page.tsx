import Login from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const LoginForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md shadow-2xl rounded-lg border-black-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-teal-600 ">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-slate-600 font-medium">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Login />
        </CardContent>
        <CardFooter className="flex justify-center text-slate-600 ">
          <p>
            Don't have an account?{" "}
            <Link href="/register" className="text-teal-600 hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
