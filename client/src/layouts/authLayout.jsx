import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

const AuthContainer = styled.div`
  // max-width: 600px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const AuthLayout = () => {
  return (
    <AuthContainer>
      <Outlet />
    </AuthContainer>
  );
};

export default AuthLayout;
