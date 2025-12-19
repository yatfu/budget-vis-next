"use client";

import IncomeExpensesForm from './IncomeExpensesForm';
import IncomeExpensesChart from './IncomeExpensesChart';
import { useState } from 'react';

const Income = () => {
  const [categories, setCategories] = useState([
    { name: 'Paycheck 1', value: '3000' },
    {name: 'Paycheck 2', value: '2900'},
  ]);

  return (
    <div className="">
            <IncomeExpensesForm categories={categories} setCategories={setCategories} />
      <IncomeExpensesChart title={"Income"}
        labels={categories.map(category => category.name)} 
        values={categories.map(category => parseFloat(category.value))}
      />
    </div>
  );
};

export default Income;