import { supabase } from "@/lib/supabase/client";
import { firebaseAuth } from "@/lib/firebase/client";
import { Goal, CreateGoalInput, UpdateGoalInput, GoalOverview, GoalsSummary } from "@/types/goal";

export async function getGoals(): Promise<Goal[]> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("financial_goals")
    .select("*")
    .eq("user_id", user.uid)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetch goals error", error);
    throw new Error("Failed to load goals. Please try again.");
  }

  return (data || []).map(row => ({
    ...row,
    target_amount: Number(row.target_amount),
    current_amount: Number(row.current_amount)
  })) as Goal[];
}

export async function createGoal(input: CreateGoalInput): Promise<Goal> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("financial_goals")
    .insert({
      user_id: user.uid,
      name: input.name,
      goal_type: input.goal_type,
      target_amount: input.target_amount,
      current_amount: input.current_amount,
      target_date: input.target_date,
      priority: input.priority,
      status: input.status,
    })
    .select("*")
    .single();

  if (error) {
    console.error("create goal error", error);
    throw new Error("Failed to create goal. Please try again.");
  }

  return { 
    ...data, 
    target_amount: Number(data.target_amount),
    current_amount: Number(data.current_amount)
  } as Goal;
}

export async function updateGoal(input: UpdateGoalInput): Promise<Goal> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Unauthorized");

  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from("financial_goals")
    .update({
      ...updates,
      ...(updates.target_date === undefined ? {} : { target_date: updates.target_date })
    })
    .eq("id", id)
    .eq("user_id", user.uid)
    .select("*")
    .single();

  if (error || !data) {
    console.error("update goal error", error);
    throw new Error("Failed to update goal. Please try again.");
  }

  return { 
    ...data, 
    target_amount: Number(data.target_amount),
    current_amount: Number(data.current_amount)
  } as Goal;
}

export async function deleteGoal(id: number): Promise<void> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("financial_goals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.uid);

  if (error) {
    console.error("delete goal error", error);
    throw new Error("Failed to delete goal. Please try again.");
  }
}

export function calculateGoalsSummary(goals: Goal[]): { overviews: GoalOverview[], summary: GoalsSummary } {
  let totalGoals = goals.length;
  let activeGoals = 0;
  let completedGoals = 0;
  let totalActiveTarget = 0;
  let totalCurrentAmount = 0;

  const overviews: GoalOverview[] = goals.map(goal => {
    let progressPercentage = 0;
    if (goal.target_amount > 0) {
      progressPercentage = (goal.current_amount / goal.target_amount) * 100;
    } else if (goal.current_amount > 0) {
      progressPercentage = 100;
    }
    
    // Clamp
    progressPercentage = Math.min(Math.max(progressPercentage, 0), 100);
    const isReached = goal.current_amount >= goal.target_amount;

    // Tracking for summary
    if (goal.status === 'active') {
      activeGoals++;
      totalActiveTarget += goal.target_amount;
    }
    
    if (goal.status === 'completed' || isReached) completedGoals++;
    
    totalCurrentAmount += goal.current_amount;

    return {
      goal,
      progressPercentage,
      isReached
    };
  });

  return {
    overviews,
    summary: {
      totalGoals,
      activeGoals,
      completedGoals,
      totalActiveTarget,
      totalCurrentAmount
    }
  };
}
