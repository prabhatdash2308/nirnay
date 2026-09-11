import { GoalsClient } from "@/components/goals/goals-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Goals | NIRNAY",
  description: "Turn your financial priorities into measurable progress.",
};

export default async function GoalsPage() {
  const c = await cookies();
  const token = c.get("firebaseIdToken")?.value;

  if (!token) {
    redirect("/auth");
  }

  return (
    <div className="container mx-auto py-8">
      <GoalsClient firebaseIdToken={token} />
    </div>
  );
}
