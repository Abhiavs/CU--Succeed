import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  redirect("/student/results");
}
