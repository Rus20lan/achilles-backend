import { useContext } from 'react';
import { InstallerContext } from '../App/App';
import './style.scss';
const ThemeSwitch = () => {
  const { installer, setInstaller } = useContext(InstallerContext);
  return (
    <div className="theme-switch__container">
      <input
        type="checkbox"
        id="theme-switch"
        onChange={() => {
          setInstaller((prev) => ({
            ...prev,
            theme: prev.theme === 'light' ? 'dark' : 'light',
          }));
        }}
        checked={installer.theme === 'dark' ? true : false}
      />
      <label htmlFor="theme-switch">Toggle</label>
    </div>
  );
};

export default ThemeSwitch;
