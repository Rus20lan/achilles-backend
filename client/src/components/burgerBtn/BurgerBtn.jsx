import { useState } from 'react';
import './style.scss';

const BurgerBtn = ({ isOpen, setIsOpen }) => {
  // const [isActive, setActive] = useState(false);
  const handleClick = () => {
    console.log('hello world');
    setIsOpen((isOpen) => {
      return !isOpen;
    });
  };

  return (
    <a
      className={`burger_btn ${isOpen ? 'active' : 'shut'}`}
      onClick={handleClick}
    >
      <b></b>
      <b></b>
      <b></b>
    </a>
  );
};

export default BurgerBtn;
