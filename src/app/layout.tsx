import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/toaster"


export const metadata: Metadata = {
  title: "Try Message",
  description: "Try Message - A simple message board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>{children}  <Toaster /></body>
      </AuthProvider>
    </html>
  );
}
