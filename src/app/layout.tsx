import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./auth-provider";
import MainNavigation from "@/components/MainNavigation";
import { MigrationNotification } from "@/components/MigrationNotification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Калькулятор Калорий",
  description: "Приложение для подсчета калорий",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <MainNavigation />
            <main className="lg:ml-64 pb-16 lg:pb-0">
              {children}
            </main>
            <MigrationNotification />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
