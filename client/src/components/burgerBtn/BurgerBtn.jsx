import { useEffect, useState } from 'react';
import './style.scss';

const BurgerBtn = ({ installer, onIsOpen, onClick }) => {
  // const [classIsOpenClose, setClassIsOpenClose] = useState('');

  const handleClick = () => {
    onIsOpen((installer) => {
      return {
        ...installer,
        isOpenBurger: !installer.isOpenBurger,
        isActiveBurgerBtn: true,
      };
    });
    onClick();
  };

  return (
    <a
      className={`burger_btn ${installer.isOpenBurger ? 'active' : 'shut'} ${
        installer.theme
      }-theme__burger_btn`}
      onClick={handleClick}
    >
      <b></b>
      <b></b>
      <b></b>
    </a>
  );
};

export default BurgerBtn;
