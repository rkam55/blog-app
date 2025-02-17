import {ReactNode, createContext, useState, useEffect} from "react";
import {User, getAuth, onAuthStateChanged} from "firebase/auth"
import { app } from "../firebase";

interface AuthProps {
    children: ReactNode,
}

// createContext : context 생성
// user의 상태를 관리해주는 context
// user의 정보가 담겨있나 안담겨있나
// user는 User or null 값
// 초기값: null (사용자 인증되지 않은 상태)
export const AuthContext = createContext({
    user: null as User | null
});

const AuthContextProvider = ({children} : AuthProps)=> {
    const auth = getAuth(app);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // 인증상태가 변경될 때마다 useEffect 호출
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
          if(user){
            setCurrentUser(user)
          }else {
            setCurrentUser(user)
          }
        })
      },[auth])

      return(
        // 인증상태를 전역적으로 관리해주는 컴포넌트
        // children (하위 컴포넌트)에게 인증상태의 값을 전달
      <AuthContext.Provider value={{ user : currentUser}}>
        {children}
      </AuthContext.Provider>
      )
}

export default AuthContextProvider;