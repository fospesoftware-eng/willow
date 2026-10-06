import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let off = false;
    fetch("/api/auth/session", { cache: "no-store", credentials: "include" })
      .then((r) => (r.ok ? r.json() : { user: null }))
      .catch(() => ({ user: null }))
      .then((d: { user: { email: string } | null }) => {
        if (off) return;
        if (!d.user) navigate("/admin/login", { replace: true });
        else setEmail(d.user.email);
      });
    return () => {
      off = true;
    };
  }, [navigate]);

  if (!email) return null;
  return <AdminDashboard email={email} />;
}
