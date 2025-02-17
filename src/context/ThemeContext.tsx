import {ReactNode, createContext, useState} from "react";


interface IThemeProps {
    children : ReactNode
}

export const ThemeContext = createContext({
    theme: "light",
    toggleMode : () => {}
})

const ThemeContextProvider = ({children} : IThemeProps) => {

    const [theme, setTheme] = useState(window.localStorage.getItem("theme") || "light");

    // window.localStorage.getItem("theme")
    // 토글을 작동 시킨 후 새로고침 F5를 하면 다시 light 모드로 초기화 된다.
    // window의 localStroage에 있는 theme를 가져옴 없으면 초기값 light
    
    const toggleMode = () => {
        setTheme((theme) => theme === "light" ? "dark" : "light");
        window.localStorage.setItem("theme",  theme === "light" ? "dark" : "light")
    }

    return (
        <ThemeContext.Provider value={{theme, toggleMode}}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContextProvider;