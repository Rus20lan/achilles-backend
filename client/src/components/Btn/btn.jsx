import React from "react";
import "./style.scss";
const Btn = React.forwardRef(
  ({ btnClassName, text, icon, onClickBtn }, ref) => {
    const handleClick = (event) => {
      event.preventDefault();
      onClickBtn(event);
      // console.log('Клик по кнопке');
    };
    return (
      <a href="#" ref={ref} className={btnClassName} onClick={handleClick}>
        {icon && <i className={`${icon} ${"icon_white"}`}></i>}
        {text}
      </a>
    );
  }
);

export default Btn;
