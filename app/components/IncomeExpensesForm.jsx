import React, { useState } from 'react';
const IncomeExpensesForm = ({categories, setCategories}) => { // { PROPS }

  const handleChange = (index, field, value) => {
    const newCategories = [...categories];
    newCategories[index][field] = value;
    setCategories(newCategories);
  };

  const addCategory = () => {
    setCategories([...categories, { name: '', value: 1000 }]);
  };

  const deleteCategory = (indexToRemove) => {
    const newCategories = categories.filter((element, index, array) => index !== indexToRemove);
    setCategories(newCategories);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted expenses:', categories);
  };

  return (
    <form onSubmit={handleSubmit}>

      {categories.map((cat, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Category Name"
            value={cat.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
            required
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Value"
            value={cat.value}
            onChange={(e) => handleChange(index, 'value', parseFloat(e.target.value))}
            required
          />
          <button type="button" onClick={() => {deleteCategory(index)}}>X</button>
        </div>
      ))}
{/* Delete function needs arrow function to pass parameters, addcategory does not, can pass function itself */}
      <div className="income-expenses-form-buttons">
        <button type="button" onClick={addCategory}>
        + Add Category
        </button>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default IncomeExpensesForm;
