

function Nav() {
  let user = undefined;
  return (
    <div className="nav py-3 flex justify-center">
      {user && (
        <>
          <a>Dashboard</a>
          <a>Expenses</a>
          <a>History</a>
        </>

      )}
      {!user && (
        <>
          <button className="">Login</button>
          <button className="">Register</button>
        </>
      )}
      </div>
  );
}

export default Nav;