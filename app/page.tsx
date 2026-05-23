"use client";
import { useState } from "react";
import Nav from './components/Nav'
import Expenses from './components/Expenses'
import Income from './components/Income'
import Ratio from './components/Ratio'

function App() {
  /* page has two tabs
       one to crud data of budget per month
       one to display data of all months */
  const [currentTab, setCurrentTab] = useState("month");

  return (
    <>
      <Nav />
      <button onClick={() => setCurrentTab("month")}>Monthly</button>
      <button onClick={() => setCurrentTab("records")}>Yearly</button>
      <div className="">
        {currentTab === "month" && 
          <div>
            <h2>Expenses</h2>
            <Expenses />
            <h2>Income</h2>
            <Income />
        </div>
        }
        {currentTab === "records" && <div className=""><Ratio /></div>}
      </div>
      
    </>
  )
}

export default App
