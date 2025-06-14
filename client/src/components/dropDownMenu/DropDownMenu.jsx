import { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './style.scss';
import useCloseOnOutsideClick from '../../hooks/useCloseOnOutsideClick';
import { InstallerContext } from '../App/App';
const DropDownMenu = ({ nameMenu, links }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);
  const {
    installer: { theme },
  } = useContext(InstallerContext);

  useCloseOnOutsideClick(dropDownRef, isOpen, setIsOpen);

  return (
    <div
      className={`dropdown__container ${theme}-theme__dropdown`}
      ref={dropDownRef}
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      <button className="dropdown__button link_header_a" aria-expanded={isOpen}>
        {nameMenu}
      </button>
      {isOpen && (
        <div className="dropdown__menu">
          <ul className="dropdown__menu_links-list">
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.url}
                  className="dropdown__menu_link link_header_a"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropDownMenu;
