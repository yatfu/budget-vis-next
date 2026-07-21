import Link from "next/link";
import { cn, buttonBase, buttonVariants, buttonSizes, cardStyles } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-8 py-10">
      <section className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-semibold">Budget Vis</h1>
        <p className="max-w-md text-muted-foreground">
          A small tool for tracking what you spend against what you&apos;ve budgeted, month by month.
        </p>
        <Link href="/register" className={cn(buttonBase, buttonVariants.default, buttonSizes.default)}>
          Get started
        </Link>
      </section>

      <section className={cn(cardStyles, "flex flex-col gap-2 p-4")}>
        <h2 className="font-medium">What is this?</h2>
        <p className="text-sm text-muted-foreground">
          Budget Vis tracks what you spend against what you&apos;ve budgeted, month by month.
          You enter your expenses and a budget number; it turns that into a single chart
          showing exactly where you stand. No categories to configure, no bank account to
          link, nothing syncing in the background.
        </p>
      </section>

      <section className={cn(cardStyles, "flex flex-col gap-2 p-4")}>
        <h2 className="font-medium">Why use it?</h2>
        <p className="text-sm text-muted-foreground">
          Most budgeting apps are built to keep you engaged — notifications, auto-categorization,
          spending insights you didn&apos;t ask for. This does one thing: turns the numbers you give
          it into a picture you can read at a glance. Nothing here is trying to hold your attention
          past the moment you check it.
        </p>
      </section>

      <section className={cn(cardStyles, "flex flex-col gap-2 p-4")}>
        <h2 className="font-medium">How does it work?</h2>
        <ol className="flex flex-col gap-1 text-sm text-muted-foreground list-decimal list-inside">
          <li>Pick a month.</li>
          <li>Add expenses as they happen — a label and an amount, nothing more.</li>
          <li>Set a budget for that month.</li>
          <li>Watch the chart shift from blue to orange to red as you approach or cross it.</li>
        </ol>
      </section>

      <section className="flex justify-center">
        <Link href="/register" className={cn(buttonBase, buttonVariants.default, buttonSizes.default)}>
          Get started
        </Link>
      </section>
    </div>
  );
}
