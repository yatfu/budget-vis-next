export type Expense = {
  id: number;
  user_id: number;
  label: string;
  amount: number;
  month: number;
  year: number;
};

export type Params = {
  params: {
    user_id: number;
  };
};

export type Query = {
  sql: string,
  values: unknown[]
}