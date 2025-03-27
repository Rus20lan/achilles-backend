import { useState } from 'react';
import BurgerBtn from '../burgerBtn/BurgerBtn';
import './style.scss';

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <BurgerBtn isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && (
        <div className={`burger_menu_container ${isOpen && 'open'}`}>
          <ul className="nav_refs">
            <li>Side 1</li>
            <li>Side 2</li>
            <li>Side 3</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default BurgerMenu;
