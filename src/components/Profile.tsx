import {useContext} from "react";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import {AuthContext} from "../context/AuthContext";
import { app } from "../firebase";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const auth = getAuth(app);
  // 일일히 가져왔던 auth를 context에 저장하여 전역적으로 사용해봅시다.
  

  const onClickLogout = async() : Promise<void> => {
    try{
      // signOut(user)가 아닌 이유
      // user: 인증된 사용자의 정보 (로그인된 사용자의 정보)
      // signOut은 auth 객체를 받아서 로그아웃 처리
      await signOut(auth);
      toast.success("로그아웃 되었습니다.");
    } catch(error : any){
      toast.error("로그아웃 실패!");
    }
  }

  return (
    <div className="profile__box">
      <div className="flex__box-lg">
        <div className="profile__image"></div>
        {/* <div className="profile__email">{auth?.currentUser?.email}</div> */}
        <div className="profile__email">{user?.email}</div>
        <div className="profile__name">{user?.displayName || "사용자"}</div>
      </div>
      <div onClick={onClickLogout} role="presentation" className="profile__logout">
        로그아웃
      </div>
    </div>
  );
};

export default Profile;
