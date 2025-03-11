import styled from 'styled-components';
import { MainAppContainer } from '../../pages/mainPage';
import { useLocation } from 'react-router';

const FooterWrapper = styled.div`
  width: 100%;
  heigth: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Footer = () => {
  const location = useLocation();
  return (
    <MainAppContainer>
      <FooterWrapper>
        <h4>Текущая страница: {location.pathname}</h4>
      </FooterWrapper>
    </MainAppContainer>
  );
};

export default Footer;
