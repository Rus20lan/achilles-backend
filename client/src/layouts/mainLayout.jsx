import { Link, Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Footer from '../components/footer/Footer';
import Loader from '../components/loader/Loader';

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
  justify-content: flex-end;
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
const MainLayout = () => {
  return (
    <MainContainer>
      <header style={{ width: '100%' }}>
        <NavContainer>
          <Link to="/" className="link_header_a">
            Home
          </Link>
          <Nav>
            <Link to="/auth/login" className="link_header_a">
              Log In
            </Link>
            <Link to="/auth/register" className="link_header_a">
              Sign Up
            </Link>
          </Nav>
        </NavContainer>
      </header>
      <main style={{ width: '100%' }}>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </MainContainer>
  );
};

export default MainLayout;
