import { createContext, useEffect, useState } from 'react';
import './app.scss';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router';
import MainLayout from '../../layouts/mainLayout';
import AuthLayout from '../../layouts/authLayout';
import LoginPage from '../../pages/loginPage';
import RegisterPage from '../../pages/registerPage';
import ProtectedRoute from '../protectedRoute/ProtectedRoute';
import MainPage from '../../pages/mainPage';
import EntityProfile from '../entityProfile/EntityProfile';
import EntityPage from '../../pages/entityPage';
import { ENTITY_LINKS } from '../../config/entities';
import AnalysisPage from '../../pages/analysisPage';

export const InstallerContext = createContext();
function App() {
  const [installer, setInstaller] = useState({
    theme: 'light',
    isOpenBurger: false,
    isActiveBurgerBtn: false,
  });

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
            <Route index element={<Navigate to="/main" replace />} />
            <Route path="auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              {/* <Route path="/main" element={<EntityPage />} /> */}
              <Route path="/main" element={<MainPage />} />
              {ENTITY_LINKS.map((link, index) => (
                <Route
                  key={index}
                  path={link.url.replace('/api', '')}
                  element={<EntityPage selectEntity={link.index} />}
                />
              ))}
              <Route path="/analysis" element={<AnalysisPage />} />
            </Route>
            <Route path="title" element={<ProtectedRoute />}>
              <Route path=":titleID" element={<EntityProfile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </InstallerContext.Provider>
  );
}

export default App;
