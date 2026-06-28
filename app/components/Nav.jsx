import { logout } from "../actions/logout";

const Nav = ({userId}) => {
  return (
    <div className="nav py-3 flex justify-center">
      {userId && (
        <>
          <a>Dashboard</a>
          <a>Expenses</a>
          <a>History</a>
          <form action={logout}>
            <button type="submit">Log Out</button>
          </form>
        </>

      )}
      {!userId && (
        <>
          <button className="">Login</button>
          <button className="">Register</button>
        </>
      )}
      </div>
  );
}

export default Nav;