import { Route, Routes, Navigate } from "react-router-dom";
import Home from "pages/home/Home";
import NewPost from "pages/posts/NewPost";
import DetailPost from "pages/posts/DetailPost";
import EditPost from "pages/posts/EditPost";
import Posts from "pages/posts/Posts";
import ProfilePage from "pages/profile/ProfilePage";
import Signup from "pages/signup/Signup";
import Login from "pages/login/Login";

interface IRouterProps {
  isAuthenticated: boolean;
}

const Router = ({isAuthenticated} : IRouterProps) => {
  // firebase Auth가 인증되면 true로 변경

  
  return (
    <Routes>
      {isAuthenticated ?
      <>
      <Route path="/" element={<Home />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/posts/:id" element={<DetailPost />} />
      <Route path="/posts/new" element={<NewPost />} />
      <Route path="/posts/edit/:id" element={<EditPost />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
      </>
    : <>
    <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login/>} />
      <Route path="*" element={<Navigate replace to="/login" />} />
    </>}
    </Routes>
  );
};

export default Router;
