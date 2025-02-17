import { db } from "../firebase";
import { useState, useContext } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { ICommentsProps, IPostsProps } from "./PostList";
import { toast } from "react-toastify";
import { AuthContext } from "context/AuthContext";

interface ICommentProps {
  post: IPostsProps;
  getPost: (id: string | undefined)=> Promise<void>
}

const Comments = ({ post, getPost }: ICommentProps) => {
  const [comment, setComment] = useState<string>("");
  const { user } = useContext(AuthContext);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  // 댓글 삭제
  const onDeletecomment = async (data : ICommentsProps) : Promise<void> => { // 댓글의 데이터를 가져와
    if(post.id) { // post.id (상세페이지_post의 id가 존재하는 경우)
      const postRef = doc(db, "posts", post.id); // 해당하는 id의 게시물을 조회
      await updateDoc(postRef, {comments: arrayRemove(data)});
      // 그 게시물에 있는 배열 comments 에서 파라미터 data 요소를 제거하겠다

      await getPost(post.id); // 문서 업데이트
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 게시물의 댓글을 등록하기 전, 댓글을 등록하는 해당 게시물이 어떤 게시물인지 알아야한다.
    try {
      if (post && post?.id) {
        // 게시물과 그 게시물의 id가 있다면
        const postRef = doc(db, "posts", post.id); // 내가 댓글 달려는 게시물
        
        if(user?.uid) { // 유저의 아이디가 있다면 (사용자 인증이 된 유저만 댓글 작성 가능)
          const commentObj = {
            contents: comment,
            uid: user.uid,
            email: user.email,
            creatAt: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          }; // commentObj 생성

          await updateDoc(postRef, {
            comments: arrayUnion(commentObj), // 배열로 들어가기 때문에 arrayUnion 함수 사용
            // arrayUinon : 배열요소를 추가
            // comments 라는 배열에 commentObj 객체를 추가 하겠다.
            updateDate: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          }); // doc을 업데이트 : postRef에 해당하는 게시물에 comment를 추가

          await getPost(post.id); // 문서 업데이트
        }
      }
      toast.success("댓글이 작성되었습니다.");
      setComment("");
    } catch (e: any) {
      toast.error("댓글작성 실패!");
    }
  };

  return (
    <div className="comments">
      <form className="comments__form" onSubmit={onSubmit}>
        <div className="form__block">
          <label htmlFor="comment">댓글 입력</label>
          <textarea name="comment" id="comment" onChange={onChange} value={comment}/>
        </div>
        <div className="form__block form__block-reverse">
          <input type="submit" value="입력" className="form__btn-submit" />
        </div>
      </form>
      <div className="comments__list">
        {post?.comments?.slice(0)?.reverse().map((c) => (
          <div key={c.uid} className="comment__box">
            <div className="comment__profile-box">
              <div className="comment__email">{c.email}</div>
              <div className="comment__date">{c.createAt}</div>
              { c.uid === user?.uid ? <div className="comment__delete"
              onClick={()=> onDeletecomment(c)}>삭제</div> : <></>}
            </div>
            <div className="comment__text">{c.contents}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
