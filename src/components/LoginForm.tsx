import { Link} from "react-router-dom";
import { useState, useCallback } from "react";
import { app } from "../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

// interface ILoginForm {
//   email: string;
//   password: string;
// }

// 타입 파일이 따로 있을거란 가정 하에
// 새로 interface를 만들지 않고 Omit을 사용
interface ISignForm {
  email: string;
  password: string;
  password_comfirm: string;
}

const Login = () => {

  const [loginForm, setLoginForm] = useState<
    Omit<ISignForm, "password_comfirm">
  >({ email: "", password: "" });
  const [error, setError] = useState<Omit<ISignForm, "password_comfirm">>({
    email: "",
    password: "",
  });

  const onChangeLogin = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setLoginForm({
        ...loginForm,
        [name]: value,
      });

      if (name === "email") {
        if (value === "") {
          setError((error) => ({
            ...error,
            email: "이메일을 입력해주세요.",
          }));
        } else {
          setError((error) => ({
            ...error,
            email: "",
          }));
        }
      }

      if (name === "password") {
        if (value === "") {
          setError((error) => ({
            ...error,
            password: "비밀번호를 입력해주세요.",
          }));
        } else {
          setError((error) => ({
            ...error,
            password: "",
          }));
        }
      }

    },
    [loginForm]
  );

  const onSubmitLogin = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const auth = getAuth(app);
        await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password)
  
        toast.success("로그인 완료!");
        // 루트 페이지로 이동 usenavigate
      } catch (error : any) {
        if(!loginForm.email){
          setError((error) => ({
            ...error,
            email: "이메일을 입력하세요.",
          }))
        } else {
          setError((error) => ({
            ...error,
            email: "",
          }))
        }
        if(!loginForm.password){
          setError((error) => ({
            ...error,
            password: "비밀번호를 입력하세요.",
          }))
        } else {
          setError((error) => ({
            ...error,
            password: "",
          }))
        }
        toast.error("정보가 일치하지 않습니다.");
      }
    },
    [loginForm]
  );

  return (
    <form className="form form--lg" onSubmit={onSubmitLogin}>
      <h1 className="form__title">로그인</h1>
      <div className="form__block">
        <label htmlFor="email">이메일</label>
        <input type="email" name="email" id="email" onChange={onChangeLogin} />
      </div>
      <div className="form__block">
        <div className="form__error">{error.email}</div>
      </div>
      <div className="form__block">
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={onChangeLogin}
        />
      </div>
      <div className="form__block">
        <div className="form__error">{error.password}</div>
      </div>
      <div className="form__block">
        계정이 없으신가요?
        <Link to="/signup" className="form__link">
          회원가입하기
        </Link>
      </div>
      <div className="form__block">
        <input type="submit" value="로그인" className="form__btn--submit" />
      </div>
    </form>
  );
};

export default Login;
