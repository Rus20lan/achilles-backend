import { Link, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import Footer from "../components/footer/Footer";
import { useResize } from "../hooks/useResize";
import BurgerMenu from "../components/burgerMenu/BurgerMenu";
import { useContext } from "react";
import { InstallerContext } from "../components/App/App";

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 100px 3fr 100px;
`;
const NavContainer = styled.div`
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  @media (max-width: 1180px) {
    width: 95%;
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
  // padding: 0.5rem 2rem;
  width: 50px; /* Задайте нужную ширину */
  height: 33px; /* Задайте нужную высоту */
  display: flex;
  justify-content: center;
  align-items: center;
`;
const MainLayout = () => {
  const { installer, setInstaller } = useContext(InstallerContext);
  const { isOpenBurger, ...tailInstaller } = installer;
  const { isScreenMD } = useResize();
  return (
    <MainContainer>
      <header style={{ width: "100%" }}>
        <NavContainer>
          <Link
            to="/"
            className={`link_header_a ${isOpenBurger && "open"}`}
            style={{ zIndex: "1000" }}
          >
            Home
          </Link>
          {!isScreenMD && (
            <Nav>
              <Link to="/auth/login" className="link_header_a">
                Log In
              </Link>
              <Link to="/auth/register" className="link_header_a">
                Sign Up
              </Link>
            </Nav>
          )}
          {isScreenMD && (
            <BurgerContainer>
              <BurgerMenu />
            </BurgerContainer>
          )}
        </NavContainer>
      </header>
      <main style={{ width: "100%" }}>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </MainContainer>
  );
};

export default MainLayout;
