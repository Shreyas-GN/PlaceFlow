"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { Loader2 } from "lucide-react";

const protectedRoutes = ["/dashboard", "/companies", "/applications", "/onboarding"];

function SessionLoader() {
  return (
    <div className="h-screen w-screen bg-[#FAFAF8] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <p className="text-xs text-gray-400">Verifying session…</p>
    </div>
  );
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, setUser, logout, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isVerifying, setIsVerifying] = useState(true);
  const [mounted, setMounted] = useState(false);
  const verifyingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !_hasHydrated) return;

    const verifySession = async () => {
      if (verifyingRef.current) return;

      const isLoginPage = pathname === "/login" || pathname === "/register";

      if (token) {
        verifyingRef.current = true;
        try {
          const user = await authService.getMe();
          setUser(user);
          if (!user.profile_complete && pathname !== "/onboarding") {
            router.push("/onboarding");
          } else if (user.profile_complete && pathname === "/onboarding") {
            router.push("/dashboard");
          } else if (isLoginPage) {
            router.push("/dashboard");
          }
        } catch (error: any) {
          // Only logout on explicit 401 — network errors shouldn't clear the session
          if (error?.response?.status === 401) {
            logout();
            if (isProtected) {
              router.replace("/login");
            }
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
  }, [mounted, _hasHydrated, token, pathname]);

  const isProtected = mounted && protectedRoutes.some(route => pathname?.startsWith(route));

  if (!mounted) return <SessionLoader />;
  if (isVerifying && isProtected) return <SessionLoader />;

  return <>{children}</>;
}
