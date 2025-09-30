"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
 
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    
    router.push("/login");
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 text-white shadow-md">

      <Link href="/" className="text-xl font-bold">
        Todo App
      </Link>

     
      <div className="flex items-center gap-4">


        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
