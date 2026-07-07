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