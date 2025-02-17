import Footer from "components/Footer";
import Header from "components/Header";
import PostList from "components/PostList";
import Profile from "components/Profile";

const Posts = () => {
    return (
        <div>
            <Header/>
            <Profile/>
            <PostList hasNavigation={true} defaultTap="all"/>
            <Footer/>
        </div>
    );
};

export default Posts;