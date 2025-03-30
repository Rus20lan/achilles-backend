import { useEffect, useState } from 'react';
import './style.scss';

const BurgerBtn = ({ installer, onIsOpen, onClick }) => {
  const [classIsOpenClose, setClassIsOpenClose] = useState('');
  const handleClick = () => {
    onIsOpen((installer) => {
      return {
        ...installer,
        isOpenBurger: !installer.isOpenBurger,
        isActiveBurgerBtn: true,
      };
    });
    if (installer.isOpenBurger) {
      setClassIsOpenClose('shut');
    } else {
      setClassIsOpenClose('active');
    }
    onClick();
  };

  return (
    <a
      className={`burger_btn ${classIsOpenClose}`}
      // className={`burger_btn ${installer.isOpenBurger ? 'active' : 'shut'}`}
      onClick={handleClick}
    >
      <b></b>
      <b></b>
      <b></b>
    </a>
  );
};

export default BurgerBtn;
