import Header from "components/Header";
import Footer from "components/Footer";
import PostList from "components/PostList";
import Carousel from "components/Carousel";
import "../../index.css";

const Home = () => {
    // 복습 시: 기능만 복습
    // 사용자 인증, 다크모드, 댓글, 보안확인
  return (
    <div>
      <Header/>
      <Carousel/>
      <PostList hasNavigation={true} defaultTap="all"/>
      <Footer/>
    </div>
  );
};

export default Home;
