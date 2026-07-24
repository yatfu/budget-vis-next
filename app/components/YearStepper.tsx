import { ChevronUp, ChevronDown } from "lucide-react"; // up down arrows
import { cn, buttonBase, buttonVariants, yearInputStyles } from "@/lib/utils";

type YearStepperProps = {
  year: number;
  setYear: (year: number) => void;
};

const YearStepper = ({ year, setYear }: YearStepperProps) => {
  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className={yearInputStyles}
      />
      <div className="flex flex-col h-9 w-6">
        <button
          type="button"
          onClick={() => setYear(year + 1)}
          aria-label="Next year"
          className={cn(buttonBase, buttonVariants.secondary, "h-1/2 w-full px-0 rounded-b-none")}
        >
          <ChevronUp className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setYear(year - 1)}
          aria-label="Previous year"
          className={cn(buttonBase, buttonVariants.secondary, "h-1/2 w-full px-0 rounded-t-none")}
        >
          <ChevronDown className="size-3.5" />
        </button>
      </div>
    </div>
  );
};

export default YearStepper;
