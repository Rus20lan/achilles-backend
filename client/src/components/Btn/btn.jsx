import './style.scss';
const Btn = ({ btnClassName, text, icon, onClickBtn }) => {
  const handleClick = (event) => {
    event.preventDefault();
    onClickBtn();
    // console.log('Клик по кнопке');
  };
  return (
    <a className={btnClassName} role="button" onClick={handleClick}>
      {icon && <i className={`${icon} ${'icon_white'}`}></i>}
      {text}
    </a>
  );
};

export default Btn;
