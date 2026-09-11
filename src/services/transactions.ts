import { supabase } from "@/lib/supabase/client";
import { firebaseAuth } from "@/lib/firebase/client";
import { Transaction, CreateTransactionInput, UpdateTransactionInput } from "@/types/transaction";

export interface GetTransactionsOptions {
  from?: string;
  to?: string;
}

export async function getTransactions(options?: GetTransactionsOptions): Promise<Transaction[]> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Unauthorized");

  let query = supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.uid)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (options?.from) {
    query = query.gte("transaction_date", options.from);
  }
  if (options?.to) {
    query = query.lte("transaction_date", options.to);
  }

  const { data, error } = await query;

  if (error) {
    console.error("fetch transactions error", error);
    throw new Error("Failed to load transactions. Please try again.");
  }

  // Convert string types from DB to correct numeric types if needed, though they usually come as strings from numeric columns.
  return (data || []).map(row => ({
    ...row,
    amount: Number(row.amount)
  })) as Transaction[];
}

export async function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.uid,
      transaction_date: input.transaction_date,
      description: input.description,
      amount: input.amount,
      type: input.type,
      category: input.category,
      note: input.note || null,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("create transaction error", error);
    throw new Error("Failed to create transaction. Please try again.");
  }

  return {
    ...data,
    amount: Number(data.amount)
  } as Transaction;
}

export async function updateTransaction(input: UpdateTransactionInput): Promise<Transaction> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Unauthorized");

  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from("transactions")
    .update({
      ...updates,
      // explicit mapping to avoid unwanted overwrites
      ...(updates.note !== undefined && { note: updates.note || null })
    })
    .eq("id", id)
    .eq("user_id", user.uid) // enforce security boundary
    .select("*")
    .single();

  if (error || !data) {
    console.error("update transaction error", error);
    throw new Error("Failed to update transaction. Please try again.");
  }

  return {
    ...data,
    amount: Number(data.amount)
  } as Transaction;
}

export async function deleteTransaction(id: number): Promise<void> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.uid); // enforce security boundary

  if (error) {
    console.error("delete transaction error", error);
    throw new Error("Failed to delete transaction. Please try again.");
  }
}
