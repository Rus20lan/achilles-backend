import { useState } from 'react';
import './style.scss';

const BurgerBtn = () => {
  const [isActive, setActive] = useState(false);
  const handleClick = () => {
    console.log('hello world');
    setActive((isActive) => {
      return !isActive;
    });
  };

  return (
    <a
      className={`burger_btn ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <b></b>
      <b></b>
      <b></b>
    </a>
  );
};

export default BurgerBtn;
