import { useContext, useState } from "react";
import BurgerBtn from "../burgerBtn/BurgerBtn";
import "./style.scss";
import { InstallerContext } from "../App/App";

const BurgerMenu = () => {
  // const [isOpen, setIsOpen] = useState(false);
  const { installer, setInstaller } = useContext(InstallerContext);
  console.log(installer);
  return (
    <>
      <BurgerBtn installer={installer} setIsOpen={setInstaller} />
      {/* <BurgerBtn isOpen={isOpen} setIsOpen={setIsOpen} /> */}
      <div
        className={`burger_menu_container ${
          installer.isOpenBurger ? "open" : "close"
        }`}
      >
        <ul className="nav_refs">
          <li>Side 1</li>
          <li>Side 2</li>
          <li>Side 3</li>
        </ul>
      </div>
    </>
  );
};

export default BurgerMenu;
