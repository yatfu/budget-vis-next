export type Expense = {
  id: number | string; // string is for temp values,
  user_id: number | string; // string is for temp values
  label: string;
  amount: number;
  month: number;
  year: number;
};

export type ExpenseUseState = {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

export type ExpenseRowProps {
  expense: Expense;
  index: number;
  onAddAmount: (index: number, delta: number) => void;
  onAddExpense: (label: string, amount: number) => void;
  onChangeExpense: <K extends keyof Expense>(index: number, field: K, value: Expense[K]) => void;
  onDeleteExpense: (index: number) => void;
}

export type Query = {
  sql: string,
  values: unknown[]
}

export type RegisterState =
  | {
      success: true;
      userId: number;
      error: null;
    }
  | {
      success: false;
      userId: null;
      error: string;
    };