import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Expense } from "./types";

// merges/dedupes tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// shared input styling per docs/design.md
export const inputStyles =
  "bg-zinc-950 border border-zinc-800 rounded-md focus:border-zinc-600 focus:outline-none px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

// shared plain-html button styling (variant="secondary" for inline actions, variant="ghost" for icon-only actions, per docs/design.md)
export const buttonBase =
  "inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

export const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-muted hover:text-foreground",
};

export const buttonSizes = {
  default: "h-9 px-3",
  sm: "h-8 px-2.5",
  icon: "size-9",
};

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
