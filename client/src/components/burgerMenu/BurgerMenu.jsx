import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import BurgerBtn from '../burgerBtn/BurgerBtn';
import './style.scss';
import { InstallerContext } from '../App/App';
import { getMenuLinks } from '../../utils/getMenuLinks';
import { useLocation } from 'react-router';

const NavBurger = styled.nav`
  margin-top: 43px;
  z-index: 1000;
  padding: 2rem 1rem;
`;

const BurgerMenu = ({ children }) => {
  const { installer, setInstaller } = useContext(InstallerContext);
  const [classNameOpen, setClassNameOpen] = useState('');
  const { pathname } = useLocation();

  const links = getMenuLinks(pathname);

  const handleOpenClick = () => {
    if (installer.isOpenBurger) {
      setClassNameOpen('close');
    } else {
      setClassNameOpen('open');
    }
  };

  const handleClickLink = (e) => {
    if (e.target.closest('a')) {
      setClassNameOpen('close');
      setInstaller((installer) => ({ ...installer, isOpenBurger: false }));
    }
  };
  return (
    <>
      <BurgerBtn
        installer={installer}
        onIsOpen={setInstaller}
        onClick={handleOpenClick}
      />
      <div
        className={`burger_menu_container ${classNameOpen}`}
        onClick={handleClickLink}
      >
        <NavBurger>
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="link_header_a">
              {link.text}
            </Link>
          ))}
        </NavBurger>
      </div>
    </>
  );
};

export default BurgerMenu;

{
  /* <NavBurger>
<Link to="/auth/login" className="link_header_a">
  Log In
</Link>
<Link to="/auth/register" className="link_header_a">
  Sign Up
</Link>
</NavBurger> */
}
