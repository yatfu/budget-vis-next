"use client";
import Nav from './components/Nav'
import Expenses from './components/Expenses'
import Income from './components/Income'
import Ratio from './components/Ratio'

{/*import ExpensesChart from './components/ExpensesChart'
import ExpensesForm from './components/ExpensesForm'*/}

function App() {

  return (
    <>
      <Nav></Nav>
      <div className="grid grid-cols-2 grid-rows-2">
        <Income />
        <div className=""><Ratio /></div>
        <Expenses />
      </div>
      
    </>
  )
}

export default App
