import { useState } from "react";
import "./style.scss";

const BurgerBtn = ({ installer, setIsOpen }) => {
  const handleClick = () => {
    console.log("hello world");
    // setIsOpen((isOpen) => {
    //   return !isOpen;
    // });
    setIsOpen((installer) => {
      return { ...installer, isOpenBurger: !installer.isOpenBurger };
    });
  };

  return (
    <a
      className={`burger_btn ${installer.isOpenBurger ? "active" : "shut"}`}
      onClick={handleClick}
    >
      <b></b>
      <b></b>
      <b></b>
    </a>
  );
};

export default BurgerBtn;
