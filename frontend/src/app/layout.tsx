import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import AuthProvider from "@/components/auth/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlaceFlow — The operating system for campus placements",
  description: "Run campus placements without spreadsheets, WhatsApp chaos, or manual tracking. PlaceFlow gives students, placement coordinators, and recruiters a single operational workspace.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-layer-1 text-white antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster position="top-center" richColors closeButton toastOptions={{ style: { background: "#18181b", border: "1px solid #27272a", color: "#f4f4f5" } }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
