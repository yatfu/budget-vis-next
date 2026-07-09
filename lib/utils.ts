import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Expense } from "./types";

// shadcn helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// get remaining expenses given budget
export function getRemainingBudget(values: number[], budget: number) { 
  const totalSpending = values.reduce((sum, value) => sum + value, 0) // consolidate expenses
  const result = budget - totalSpending;
  if (result > 0) {
    return result;
  }
  return 0;
}

export const months: Record<number, string> = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};
