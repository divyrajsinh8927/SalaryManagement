import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Salary App",
  description: "Track your monthly salary, deductions, and attendance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
