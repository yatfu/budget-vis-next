import { months, inputStyles, cn } from '@/lib/utils'

type DateSelectorProps = {
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
};

const DateSelector = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}: DateSelectorProps) => {
  return (
    <div className="flex items-center gap-1">
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(Number(e.target.value))}
        className={inputStyles}
      >
        <option value={1}>January</option>
        <option value={2}>February</option>
        <option value={3}>March</option>
        <option value={4}>April</option>
        <option value={5}>May</option>
        <option value={6}>June</option>
        <option value={7}>July</option>
        <option value={8}>August</option>
        <option value={9}>September</option>
        <option value={10}>October</option>
        <option value={11}>November</option>
        <option value={12}>December</option>
        {/* ... */}
      </select>
      <input
        className={cn("w-20", inputStyles)}
        type="number"
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
      />
    </div>
  );
};

export default DateSelector;
