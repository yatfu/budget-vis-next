"use client";
import Nav from './components/Nav'
import Expenses from './components/Expenses'
import Ratio from './components/Ratio'

{/*import ExpensesChart from './components/ExpensesChart'
import ExpensesForm from './components/ExpensesForm'*/}

function App() {

  return (
    <>
      <Nav></Nav>
      <div id="income-expenses-section">
        <Expenses />
        <Ratio />
      </div>
      
    </>
  )
}

export default App
