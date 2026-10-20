"use client";

// Abinash's Expense Tracker (2025), ported from JSX to TSX. His logic: localStorage persistence,
// validation (all fields, amount > 0), newest first, delete, running total in NPR.
// Changes: types, toasts → an inline status line, icons → text, styling → the site's paper tokens.
import { useEffect, useState, type FormEvent } from "react";

type Expense = { id: string; description: string; amount: number; category: string; createdAt: string };

const LOCAL_KEY = "expenses_list_v2";
const categories = ["Food", "Travel", "Education", "Shopping", "Utilities", "Health", "Other"];
const input = "w-full border-b bg-transparent py-2 outline-none focus:border-accent";

function ExpenseForm({ onAddChange, onMessage }: { onAddChange: (e: Expense) => void; onMessage: (m: string) => void }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!description || !amount || !category) {
      onMessage("Please fill all fields!");
      return;
    }
    if (parseFloat(amount) <= 0) {
      onMessage("Amount must be greater than zero!");
      return;
    }
    const newExpense: Expense = {
      id: Math.random().toString(36).substring(2, 9),
      description,
      amount: parseFloat(amount),
      category,
      createdAt: new Date().toISOString(),
    };
    onAddChange(newExpense);
    setDescription("");
    setAmount("");
    setCategory("");
    onMessage("Expense added!");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        aria-label="Description"
        placeholder="Expense description (e.g., Coffee)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={input}
      />
      <input
        type="number"
        aria-label="Amount in NPR"
        placeholder="Amount (NPR)"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={input}
      />
      <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)} className={`${input} bg-background`}>
        <option value="">Select a category</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button type="submit" className="bg-foreground px-5 py-2.5 font-mono text-sm text-background">
        Add expense
      </button>
    </form>
  );
}

function ExpenseList({ expenses, onDelete, total }: { expenses: Expense[]; onDelete: (id: string) => void; total: number }) {
  if (expenses.length === 0) {
    return <p className="text-sm text-muted-foreground">No expenses recorded yet. Add some!</p>;
  }
  return (
    <div>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id} className="flex items-center justify-between gap-4 border-t py-3">
            <div className="grow">
              <p className="font-medium">{expense.description}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {expense.category} · {new Date(expense.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="font-mono text-sm tabular-nums">NPR {expense.amount.toFixed(2)}</span>
            <button onClick={() => onDelete(expense.id)} className="label link-draw hover:text-foreground" aria-label="Delete expense">
              delete
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-baseline justify-between border-t-2 border-foreground pt-3">
        <p className="label">Total spent</p>
        <p className="font-mono text-2xl tabular-nums">NPR {total.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default function ExpenseTracker() {
  // Reads localStorage while rendering, so this component is loaded with `ssr: false` (see apps.tsx).
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    try {
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error parsing expenses from localStorage:", error);
      return [];
    }
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(expenses));
  }, [expenses]);

  function handleAddExpense(newExpense: Expense) {
    setExpenses((prev) => [newExpense, ...prev]);
  }

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    setStatus("Expense deleted!");
  };

  const updateTotal = expenses.reduce((acc, expense) => acc + expense.amount, 0);

  return (
    <div className="space-y-8">
      <ExpenseForm onAddChange={handleAddExpense} onMessage={setStatus} />
      <p role="status" aria-live="polite" className="min-h-5 font-mono text-xs text-accent-text">
        {status}
      </p>
      <ExpenseList expenses={expenses} onDelete={deleteExpense} total={updateTotal} />
    </div>
  );
}
