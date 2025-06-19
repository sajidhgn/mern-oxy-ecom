import React, { FC } from "react";
import MainNav2Logged from "./MainNav2Logged";

export interface HeaderLoggedProps { }

const HeaderLogged: FC<HeaderLoggedProps> = () => {
  return (
    <div className="ox-HeaderLogged sticky top-0 w-full z-40 ">
      <MainNav2Logged />
    </div>
  );
};

export default HeaderLogged;
