import { useContext, useEffect, useMemo, useState } from 'react';
import BurgerBtn from '../burgerBtn/BurgerBtn';
import './style.scss';
import { InstallerContext } from '../App/App';

const BurgerMenu = () => {
  const { installer, setInstaller } = useContext(InstallerContext);
  const [classNameOpen, setClassNameOpen] = useState('');

  const handleOpenClick = () => {
    if (installer.isOpenBurger) {
      setClassNameOpen('close');
    } else {
      setClassNameOpen('open');
    }
  };
  return (
    <>
      <BurgerBtn
        installer={installer}
        onIsOpen={setInstaller}
        onClick={handleOpenClick}
      />
      <div className={`burger_menu_container ${classNameOpen}`}>
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
