import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { db, isDatabaseAvailable } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";

export const dynamic = "force-dynamic";

async function getUserFromCookie() {
  try {
    if (!isDatabaseAvailable()) return null;

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    if (!token) {
      return null;
    }
    
    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }

    const result = await db
      .select({
        id: users.id,
        email: users.email,
        namaGuru: users.namaGuru,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("Error in getUserFromCookie:", error);
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userData = await getUserFromCookie();

  if (!userData) {
    redirect("/login");
  }

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <div className="no-print">
          <Navbar user={userData} />
        </div>
        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
        <div className="no-print">
          <Footer />
        </div>
      </div>
    </ToastProvider>
  );
}
