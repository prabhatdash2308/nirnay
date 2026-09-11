export type TransactionType = "income" | "expense";

export interface Transaction {
  id: number;
  user_id: string;
  transaction_date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionInput {
  transaction_date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  note?: string | null;
}

export interface UpdateTransactionInput extends Partial<CreateTransactionInput> {
  id: number;
}
