import Expenses from '@/app/components/Expenses'
import { months } from '@/lib/utils';

type props = {
  searchParams: Promise<{ month?: string; year?: string }>};

export default async function Dashboard({ searchParams }: props)  {
  const params = await searchParams;

  const selectedMonth =
    Number(params.month) || new Date().getMonth() + 1;
  const selectedYear =
    Number(params.year) || new Date().getFullYear();

  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-foreground text-lg font-medium">{months[selectedMonth]} {selectedYear}</h2>
      <Expenses />
    </div>
  );
}
