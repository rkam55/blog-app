import { initializeApp, FirebaseApp, getApp } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";

export let app: FirebaseApp;
// app의 타입은 FirebaseApp

const firebaseConfig = {
  // firebase 프로젝트 설정 값
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET ,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID ,
  appId: process.env.REACT_APP_APP_ID
};

try{
  app = getApp("app");
  // getApp: Firebase의 SDK에서 제공하는 함수.
  // Firebase 애플리케이션 인스턴스를 가져오는 함수
  // 이미 초기화된 "app" 인스턴스를 반환

  // 'app'이라는 이름으로 초기화된 Firebase 앱을 가져옵니다.
} catch(e) {
  app = initializeApp(firebaseConfig);
  // initializeApp: 앱을 초기화한 후에만 사용
  // 초기화되지 않은 상태로 getApp 호출되면 ERROR
  // -> 초기화되지 않았다면 다시 초기화해서 가져오기

  // 'app'이 없으면 firebaseConfig로 앱을 새로 초기화합니다.
}

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export default firebase;

// firestore - 데이터베이스
export const db = getFirestore(app);

