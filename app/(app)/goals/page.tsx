import { GoalsClient } from "@/components/goals/goals-client";

export const metadata = {
  title: "Goals | NIRNAY",
  description: "Turn your financial priorities into measurable progress.",
};

export default function GoalsPage() {
  return (
    <div className="container mx-auto py-8">
      <GoalsClient />
    </div>
  );
}
