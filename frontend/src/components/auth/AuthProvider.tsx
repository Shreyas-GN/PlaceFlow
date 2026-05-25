"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const protectedRoutes = ["/dashboard", "/companies", "/applications"];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, setUser, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isVerifying, setIsVerifying] = useState(true);
  const [mounted, setMounted] = useState(false);
  const verifyingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const verifySession = async () => {
      if (verifyingRef.current) return;
      
      const isLoginPage = pathname === "/login" || pathname === "/register";

      if (token) {
        verifyingRef.current = true;
        try {
          const user = await authService.getMe();
          setUser(user);
          if (isLoginPage) {
            router.push("/dashboard");
          }
        } catch (error) {
          logout();
          if (isProtected) {
            router.replace("/login");
          }
        } finally {
          verifyingRef.current = false;
        }
      } else if (isProtected) {
        router.replace("/login");
      }
      
      setIsVerifying(false);
    };

    verifySession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, token, pathname]);

  const isProtected = mounted && protectedRoutes.some(route => pathname?.startsWith(route));

  if (!mounted) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-screen w-screen bg-zinc-950 flex flex-col items-center justify-center gap-6"
      >
        <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-16 h-16 border-2 border-primary/20 rounded-full absolute inset-0"
            />
            <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
        </div>
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-600"
        >
          Authenticating Session
        </motion.p>
      </motion.div>
    );
  }

  if (isVerifying && isProtected) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-screen w-screen bg-zinc-950 flex flex-col items-center justify-center gap-6"
      >
        <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-16 h-16 border-2 border-primary/20 rounded-full absolute inset-0"
            />
            <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
        </div>
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-600"
        >
          Authenticating Session
        </motion.p>
      </motion.div>
    );
  }

  return <>{children}</>;
}
