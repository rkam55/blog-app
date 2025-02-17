import { ToastContainer } from "react-toastify";
import Router from "./components/Router";
import {app} from "./firebase";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useState, useEffect, useContext} from "react";
import Loader from "./components/Loader";
import { ThemeContext } from "context/ThemeContext";

const App = () => {
  // 인증
  const auth = getAuth(app);
  const context = useContext(ThemeContext)

  // 메인 홈화면이 뜨기전에 로그인 화면이 잠깐 씩 보이는 문제 해결!

  // auth를 체크하기 전(initalize 전)에 loader를 띄워주는 용도
  // auth가 currentUser가 있으면 authenticated로 변경
  const [init, setInit] = useState<boolean>(false)
  

  // 인증 여부
  // !! auth?.currentUser: 현재 유저가 인증이 된 상태인지? 여부를 확인하는 !!연산자
  // 있으면 true, 없으면 false
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!! auth?.currentUser);

  // 로그인이 될 경우 상태관리
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user){
        setIsAuthenticated(true)
      }else {
        setIsAuthenticated(false)
      }
      setInit(true);
    })
  },[auth])

  return (
    <div className={context.theme === "light" ? "white" : "dark"}>
    <ToastContainer />
    {init ? <Router isAuthenticated={isAuthenticated}/> : <Loader/>}
    </div>
  );
};

export default App;