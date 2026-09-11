export type GoalType = 'emergency_fund' | 'retirement' | 'house' | 'car' | 'education' | 'travel' | 'custom';
export type GoalPriority = 'low' | 'medium' | 'high';
export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

export interface Goal {
  id: number;
  user_id: string;
  name: string;
  goal_type: GoalType;
  target_amount: number;
  current_amount: number;
  target_date: string | null; // YYYY-MM-DD
  priority: GoalPriority;
  status: GoalStatus;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateGoalInput {
  name: string;
  goal_type: GoalType;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  priority: GoalPriority;
  status: GoalStatus;
}

export interface UpdateGoalInput extends Partial<CreateGoalInput> {
  id: number;
}

export interface GoalOverview {
  goal: Goal;
  progressPercentage: number; // 0-100 clamped
  isReached: boolean;
}

export interface GoalsSummary {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalActiveTarget: number;
  totalCurrentAmount: number;
}
