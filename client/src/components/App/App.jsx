import { createContext, useEffect, useState } from 'react';
import './app.scss';
import { Route, Routes, BrowserRouter } from 'react-router';
import MainLayout from '../../layouts/mainLayout';
import AuthLayout from '../../layouts/authLayout';
import LoginPage from '../../pages/loginPage';
import RegisterPage from '../../pages/registerPage';
import ProtectedRoute from '../protectedRoute/ProtectedRoute';
import { useSelector } from 'react-redux';
import EntityProfile from '../entityProfile/EntityProfile';
import MainPage from '../../pages/mainPage';

export const InstallerContext = createContext();
function App() {
  const [installer, setInstaller] = useState({
    theme: 'light',
    isOpenBurger: false,
    isActiveBurgerBtn: false,
  });
  const { user } = useSelector((state) => state.authData);

  // Данный эффект удаляет token из localStorage при закрытие приложения
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('token');
      console.log('Токен удален при закрытие приложения');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <InstallerContext.Provider value={{ installer, setInstaller }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
            <Route
              path="main"
              element={
                <ProtectedRoute user={user}>
                  <MainPage />
                </ProtectedRoute>
              }
            />
            <Route path="/title" element={<ProtectedRoute user={user} />}>
              <Route path=":titleID" element={<EntityProfile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </InstallerContext.Provider>
  );
}

export default App;
