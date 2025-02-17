import { IoSunnyOutline } from "react-icons/io5";
import { CiDark } from "react-icons/ci";
import {useContext} from "react";
import { ThemeContext } from "context/ThemeContext";

const Footer = () => {

  const context = useContext(ThemeContext);

  const onToggleTheme = () => {
    context.toggleMode();
  }

    return (
        <footer>
          <div onClick={onToggleTheme}>
          {context.theme === "light" ?
          <IoSunnyOutline className="footer__theme-btn"/>:
          <CiDark className="footer__theme-btn"/>
          }
          </div>
      </footer>
    );
};

export default Footer;