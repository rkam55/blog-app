
import Footer from "components/Footer";
import Header from "components/Header";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IPostsProps} from "components/PostList";
import { getDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import Comments from "components/Comments";

const DetailPost = () => {

  const navigate = useNavigate();

  // getDoc: ref를 통해 doc 가져오기
  // docRef: 아이디에 해당하는 게시물을 상세페이지에 띄워야함
  const [post, setPost] = useState<IPostsProps | null>(null);

  // useParams 훅 사용 : 경로의 param을 가져오도록 하는 훅 (경로에 id를 가져오기 위함)
  const {id} = useParams();

  const getPost = async(id: string | undefined) => {
    if(id) {
      const detailRef = doc(db, "posts", id);
      // 아이디에 해당하는 게시물을 상세페이지에 띄워야함
      // db이름이 posts인 doc를 가져와 id를 docRef에 저장

      const detailData = await getDoc(detailRef);
      // docRef - 아이디에 해당하는 doc를 가져와 docSnap에 저장

      setPost({
        id: detailData.id,
        ...detailData?.data() as IPostsProps
        // title: docData?.data()?.title,
        // contents: docData?.data()?.contents,
        // email:docData?.data()?.email,
        // createAt: docData?.data()?.createAt
      })
    }
  }
  
  useEffect(()=> {
    getPost(id);
  },[id])

  const onClickDelete = async(e: React.MouseEvent<HTMLDivElement>) => {
    if (post && post.id) {
      try {
        await deleteDoc(doc(db, "posts", post.id));
        toast.success("삭제되었습니다.");
        // 삭제 후 홈으로 이동
        navigate("/");
      } catch (error) {
        toast.error("삭제 중 오류가 발생했습니다.");
      }
    }
  }

  return (
    <div>
      <Header />
      {post ?
        <div className="post__detail">
        <div className="post__box">
          <div className="post__title">{post?.title}</div>
          <div className="post__profile-box">
            <div className="post__profile"></div>
            <div className="post__author-name">사용자 {id}</div>
            <div className="post__date">{post?.createAt}</div>
          </div>
          <div className="post__text--pre-wrap">{post?.contents}</div>
          <div className="post__text">{post?.category}</div>
          <div className="post__utils-box">
            <div className="post__delete" onClick={onClickDelete}>
             삭제
              </div>
            <div className="post__edit"> <Link to={`/posts/edit/${id}`}>수정</Link></div>
          </div>
        </div>
        <Comments post={post} getPost={getPost}/>
      </div>
       : 
      <div className="post__no-post">게시물이 없습니다.</div>}

      <Footer />
    </div>
  );
};

export default DetailPost;
