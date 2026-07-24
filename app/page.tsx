import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  cn,
  buttonBase,
  buttonVariants,
  buttonSizes,
  cardStyles,
} from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-3 py-15">
      <section className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-semibold">Budget Viz</h1>
        <p className="max-w-md text-muted-foreground">
          A small tool for tracking what you spend against what you&apos;ve
          budgeted, month by month.
        </p>
        <div className="flex items-center gap-2 my-4">
          <Link
            href="/register"
            className={cn(
              buttonBase,
              buttonVariants.default,
              buttonSizes.default
            )}
          >
            Get started
          </Link>
          <a
            href="https://github.com/yatfu/budget-vis-next"
            target="_blank"
            className={cn(
              buttonBase,
              buttonVariants.secondary,
              buttonSizes.default
            )}
          >
            GitHub
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className={cn(cardStyles, "flex flex-col gap-2 p-4")}>
        <h2 className="font-medium">What is this?</h2>
        <p className="text-sm text-muted-foreground">
          Budget Viz is a place for you to efficiently keep track of your
          expenses month by month without having to link to external accounts.
        </p>
        <p className="text-sm text-muted-foreground">
          From your inputs, Budget Viz provides clear, concise visualizations of
          only the most important metrics and statistics.
        </p>
      </section>

      <section className={cn(cardStyles, "flex flex-col gap-2 p-4")}>
        <h2 className="font-medium">Why use it?</h2>
        <p className="text-sm text-muted-foreground">
          Many budgeting apps are feature-rich, providing complex visualizations
          and tools for every type of budgeting strategy. This can be a
          disservice to the user by being distracting, giving too many options,
          and increasing friction when navigating through the app.
        </p>
        <p className="text-sm text-muted-foreground">
          Budget Viz is an attempt to solve this issue through its design
          philosophy, simplifying the interface, providing clarity through its
          color scheme, and minimizing the amount of taps, clicks, and
          keystrokes per action.
        </p>
      </section>

      <section className={cn(cardStyles, "flex flex-col gap-2 p-4")}>
        <h2 className="font-medium">How does it work?</h2>
        <ol className="flex flex-col gap-1 text-sm text-muted-foreground list-decimal list-inside">
          <li>Pick a month.</li>
          <li>
            Add expenses as they happen: a label and an amount, nothing else.
          </li>
          <li>Set a budget for that month.</li>
          <li>Click save.</li>
        </ol>
      </section>

      <section className="flex justify-center">
        <Link
          href="/register"
          className={cn(
            buttonBase,
            buttonVariants.default,
            buttonSizes.default
          )}
        >
          Get started
        </Link>
      </section>
    </div>
  );
}
