import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Footer from '../components/footer/Footer';
import { useResize } from '../hooks/useResize';
import BurgerMenu from '../components/burgerMenu/BurgerMenu';
import { useContext } from 'react';
import { InstallerContext } from '../components/App/App';
import { useDispatch, useSelector } from 'react-redux';
import logoutSvg from '../assets/log-out.svg';
import { logout } from '../redux/slices/authDataSlice';
import ThemeSwitch from '../components/themeSwitch/ThemeSwitch';
import DropDownMenu from '../components/dropDownMenu/DropDownMenu';
import { ENTITY_LINKS } from '../config/entities';

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  min-height: 100vh;
  grid-template-rows: 80px 1fr 100px;
  // background-color: inherit;
`;
const NavContainer = styled.div`
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  @media (max-width: 1180px) {
    width: 95%;
  }
  @media (max-width: 696px) {
    justify-content: flex-end;
    padding-top: 10px;
  }
`;
const Nav = styled.nav`
  max-width: 300px;
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

const BurgerContainer = styled.div`
  position: relative;
  box-sizing: border-box;
  top: 2px;
  width: 50px; /* Задайте нужную ширину */
  height: 33px; /* Задайте нужную высоту */
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LogoutBtn = styled.a`
  display: flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  &:active {
    transform: scale(0.8);
  }
  img {
    width: 100%;
    height: 100%;
    objectfit: 'cover';
  }
`;
const LogoutIcon = styled.img`
  filter: ${({ $isDark }) =>
    $isDark === 'dark'
      ? 'invert(92%) sepia(41%) saturate(511%) hue-rotate(185deg) brightness(99%) contrast(117%)'
      : 'invert(10%) sepia(88%) saturate(3678%) hue-rotate(268deg) brightness(95%) contrast(96%)'};
  transition: filter 0.3s;
`;
const MainLayout = () => {
  const { installer } = useContext(InstallerContext);
  const { isOpenBurger, theme, ...tailInstaller } = installer;
  const { user } = useSelector((state) => state.authData);
  const { isScreenMD } = useResize();
  const dispatch = useDispatch();

  const linksWithoutAPI = ENTITY_LINKS.map((link) => ({
    ...link,
    url: link.url.replace('/api', ''),
  }));
  return (
    <div className={`main-app-container ${theme}-theme__main-container`}>
      <header style={{ display: 'flex', width: '100%' }}>
        <NavContainer>
          {!isScreenMD && (
            <>
              {!user && (
                <Nav>
                  <Link to="/title/1" className="link_header_a">
                    1
                  </Link>
                  <Link to="/auth/login" className="link_header_a">
                    Вход
                  </Link>
                  <Link to="/auth/register" className="link_header_a">
                    Регистрация
                  </Link>
                </Nav>
              )}
              {user && (
                <>
                  <div className="left_header_wrapper">
                    <Link to="/" className="link_header_a">
                      Home
                    </Link>
                    <DropDownMenu
                      nameMenu={'Справочник'}
                      links={linksWithoutAPI}
                    />
                  </div>
                  <Link to="/title/1" className="link_header_a">
                    1
                  </Link>
                  <ThemeSwitch />
                  <LogoutBtn href="#" onClick={() => dispatch(logout())}>
                    <LogoutIcon src={logoutSvg} $isDark={installer.theme} />
                  </LogoutBtn>
                </>
              )}
            </>
          )}
          {isScreenMD && (
            <BurgerContainer>
              <BurgerMenu></BurgerMenu>
            </BurgerContainer>
          )}
        </NavContainer>
      </header>
      <main style={{ width: '100%', height: '100%' }}>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
