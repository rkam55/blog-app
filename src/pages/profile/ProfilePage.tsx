import Footer from 'components/Footer';
import Header from 'components/Header';
import PostList from 'components/PostList';
import Profile from 'components/Profile';

const ProfilePage = () => {
    return (
        <div>
            <Header/>
            <Profile/>
            <PostList hasNavigation={false} defaultTap='my'/>
            <Footer/>
        </div>
    );
};

export default ProfilePage;