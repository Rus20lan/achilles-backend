import { useContext } from "react";
import { InstallerContext } from "../components/App/App";
import { MainAppContainer } from "./entityPage";

const MainPage = () => {
  const {
    installer: { theme },
  } = useContext(InstallerContext);
  return (
    <MainAppContainer>
      <div className={`entity_container ${theme}-theme__container`}>
        <div className={`entity_section ${theme}-theme__section`}>
          <h2>Main Page</h2>
        </div>
      </div>
    </MainAppContainer>
  );
};
export default MainPage;
