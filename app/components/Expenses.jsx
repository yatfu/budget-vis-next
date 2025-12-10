"use client";

import IncomeExpensesForm from './IncomeExpensesForm';
import IncomeExpensesChart from './IncomeExpensesChart';
import { useState } from 'react';

const Expenses = () => {
  const [categories, setCategories] = useState([
    { name: 'Housing/Rent', value: '3000' },
    { name: 'Utilities', value: '500'},
    { name: 'Food', value: '1000'},
    { name: 'Other', value: '500'}
  ]);

  return (
    <div className="expenses">
            <IncomeExpensesForm categories={categories} setCategories={setCategories} />
      <IncomeExpensesChart title={"Expenses"}
        labels={categories.map(category => category.name)} 
        values={categories.map(category => parseFloat(category.value))}
      />
    </div>
  );
};

export default Expenses;