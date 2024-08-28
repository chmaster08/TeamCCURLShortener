"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import Drawer from "@/components/Drawer";
import { AuthProvider } from "@/hooks/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-full`}>
        <AuthProvider>
          <Header toggleDrawer={toggleDrawer} />
          <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
