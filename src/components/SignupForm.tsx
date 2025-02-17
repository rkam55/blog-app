import { Link, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import {app} from "../firebase";
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import {toast} from "react-toastify";


interface ISignForm {
  email: string;
  password: string;
  password_comfirm: string;
}

const SignupForm = () => {

  const [signForm, setSignForm] = useState<ISignForm>({
    email: "",
    password: "",
    password_comfirm: "",
  });
  const [vaildForm, setVaildForm] = useState<ISignForm>({
    email: "",
    password: "",
    password_comfirm: "",
  });

  const navigate = useNavigate()

  // 실시간으로 유효성 검사
  const onChangeForm = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      //const { name, value } = e.target;
      // e.target이 중복되니까 name, value를 따로 뺀 것..

      // 입력값 업데이트
      // setSignForm({
      //   ...signForm,
      //   [name]: value,
      // });
      // 아래와 다르게 동적으로 필드를 다루는게 아님
      // name은 고정된 이름에 값만 넣어줌

      setSignForm({
        ...signForm,
        [e.target.name]: e.target.value,
      });
       //    어떤 이름의 값을 자동으로 넣어줌
      //    name이 email인 태그의 value에 값을 넣어준다.
      //    rest연산자를 통해 기존 값은 두고, name에 맞는 값을 자동으로 넣어준다.
    

      // 유효성 검사
      const validEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

      // 이메일 검사
      if (e.target.name === "email") {
        if (!e.target.value.match(validEmail)) {
          setVaildForm((prevState) => ({
            ...prevState,
            email: "이메일 형식이 올바르지 않습니다.",
          }));
        } else {
          setVaildForm((prevState) => ({
            ...prevState,
            email: "",
          }));
        }
      }

      // 비밀번호 길이 검사
      if (e.target.name === "password") {
        if (e.target.value.length < 8) {
          setVaildForm((prevState) => ({
            ...prevState,
            password: "비밀번호는 8자리 이상 입력해주세요.",
          }));
        } else {
          setVaildForm((prevState) => ({
            ...prevState,
            password: "",
          }));
        }
      }

      // 비밀번호 확인 검사
      if (e.target.name === "password_comfirm") {
        if (e.target.value !== signForm.password || e.target.value.length < 8) {
          setVaildForm((prevState) => ({
            ...prevState,
            password_comfirm: "비밀번호를 다시 확인해주세요.",
          }));
        } else {
          setVaildForm((prevState) => ({
            ...prevState,
            password_comfirm: "",
          }));
        }
      }

      // 차이점: signForm은 상태 업데이트가 바로 반영되지 않음
      // password_comfirm: "비밀번호를 다시 확인해주세요." 가 바로 실행되지 않는단 뜻
      // BUT: e.target.name 은 onChange가 일어날 때마다 즉시 반영해줌!

      // if(signForm.password_comfirm?.length < 8 || signForm.password_comfirm !== signForm.password ){
      //   setVaildForm({
      //     ...vaildForm,
      //     password_comfirm: "비밀번호를 다시 확인해주세요."
      //   })
      //   console.log("비밀번호를 다시 확인해주세요.")
      // }else {
      //   setVaildForm({
      //     ...vaildForm,
      //     password_comfirm: ""
      //   })
      // }

    },
    [signForm]
  );

  // 파이어베이스를 통해 api 보내야지 서버로 보내서 정보를 저장
  const onSubmit = useCallback( async (e : React.FormEvent<HTMLFormElement>)=> {
    e.preventDefault();
    try{
      const auth = getAuth(app); // 인증확인을 위해 파이어베이스 앱을 가져와

      // 파이어베이스의 회원가입 함수 (유저생성: 유저의 이메일, 패스워드를 만들어)
      // 양식: createUserWithEmailAndPassword(auth: Auth, email: string, password: string)
      await createUserWithEmailAndPassword(auth, signForm.email, signForm.password);
      toast.success("회원가입 완료");
      navigate("/");
    }catch(error : any){
      console.log(error)
      toast.error("error")
    }
    
  },[signForm])

  return (
    <form className="form form--lg" onSubmit={onSubmit}>
      <h1 className="form__title">회원가입</h1>

      <div className="form__block">
        <label htmlFor="email">이메일</label>
        <input
          type="email"
          name="email"
          id="email"
          value={signForm.email}
          onChange={onChangeForm}
        />
        <div className="form__error">{vaildForm.email}</div>
      </div>

      <div className="form__block">
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          name="password"
          id="password"
          value={signForm.password}
          onChange={onChangeForm}
        />
        <div className="form__error">{vaildForm.password}</div>
      </div>

      <div className="form__block">
        <label htmlFor="password_comfirm">비밀번호 확인</label>
        <input
          type="password"
          name="password_comfirm"
          id="password_comfirm"
          value={signForm.password_comfirm}
          onChange={onChangeForm}
        />
        <div className="form__error">{vaildForm.password_comfirm}</div>
      </div>

      <div className="form__block">
        계정이 이미 있으신가요?
        <Link to="/login" className="form__link">
          로그인하기
        </Link>
      </div>

      <div className="form__block">
        <input
          type="submit"
          value="회원가입"
          className="form__btn--submit"
          disabled={
            !!vaildForm.email || !!vaildForm.password || !!vaildForm.password_comfirm
          }
        />
      </div>
    </form>
  );
};

export default SignupForm;
