"use client";
import { useAuth } from "@/hooks/AuthContext";
import Links from "../../features/management/Links";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ManagementPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return <Links />;
}
