import "./style.scss";
const Btn = ({ btnClassName, text, icon }) => {
  return (
    <a className={btnClassName} role="button">
      {icon && <i className={icon}></i>}
      {text}
    </a>
  );
};

export default Btn;
