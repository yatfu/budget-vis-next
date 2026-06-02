"use client";
import { useState } from "react";

function Nav() {
  const [currentTab, setCurrentTab] = useState("month");
  
  return (
    <div className="nav py-3 flex justify-center">
      <button className="">Sign In not implemented</button>
      <button onClick={() => setCurrentTab("month")}>Monthly</button>
      <button onClick={() => setCurrentTab("records")}>Yearly</button>
    </div>
  );
}

export default Nav;