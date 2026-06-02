
import Nav from './components/Nav'
import Expenses from './components/Expenses'

function App() {
  /* page has two tabs
       one to crud data of budget per month
       one to display data of all months */

  return (
    <>
      <Nav />
      <div className="">
        <Expenses />
      </div>
      
    </>
  )
}

export default App
