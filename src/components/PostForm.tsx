import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { CATEGORIES, CategoryType, IPostsProps } from "./PostList";

interface IPostForm {
  title: string;
  contents: string;
  category: CategoryType;
}

const PostForm = () => {
  const [form, setForm] = useState<IPostForm>({
    title: "",
    contents: "",
    category: "",
  });
  const { user } = useContext(AuthContext);
  // const auth = getAuth(app)

  // PostForm이 수정하기 인지, 새로 글쓰기인지 확인하기 위함
  // post : 수정할 폼 데이터
  // form : 새로 글 작성할 때 저장할 데이터
  const { id } = useParams();
  const [post, setPost] = useState<IPostsProps | null>(null);

  const navigation = useNavigate();

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // 또다른 문제: 수정을 할 때 수정한 부분만 업데이트되고 나머지 수정안한건 초기화가 돼.

    setForm({
      ...form,
      [name]: value,
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (post && post.id) {
        // post 데이터, post.id가 있다면 수정!
        const postRef = doc(db, "posts", post?.id); // post.id를 찾아 ref에 담아

        // 양식: updateDoc (ref, {수정할 내용 데이터})
        await updateDoc(postRef, {
          // 수정하려는 게시물의 id
          title: form.title, // -> 그 id의 게시물 수정 내용
          contents: form.contents,
          createAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit", // 최신순으로 변경하기 위함
            minute: "2-digit",
            second: "2-digit",
          }),
          category: form.category,
          // 수정된 내용이 저장되지 않은 이유!!!!!!!!!!!!!!!!!!!!!!!!!!1
          // 실제로는 form 내용이 바뀌어야한다.
        });

        toast.success("게시물이 수정 되었습니다.");
        navigation(`/posts/${post.id}`);
      } else {
        await addDoc(collection(db, "posts"), {
          title: form.title,
          contents: form.contents,
          createAt: new Date().toLocaleDateString("ko", {
            hour: "2-digit", // 최신순으로 변경하기 위함
            minute: "2-digit",
            second: "2-digit",
          }),
          email: user?.email,
          uid: user?.uid,
          category: form.category,
          // auth?.currentUser?.email
        });
        toast.success("게시물이 업로드 되었습니다.");
        // fireStore에서 제공하는 addDoc 함수
        // 컬렉션: firebase 앱에서 가져온 db에 저장
        // 컬렉션의 이름은 "posts"
        // posts 컬렉션 안의 컬럼들 (title, contents, createAt, email)
        navigation("/"); // 게시물 업로드 후 home으로 이동
      }
    } catch (e: any) {
      toast.error(e);
    }
  };

  useEffect(() => {
    // 게시물 수정이 안되는 에러 발생
    // 이 useEffect는 id가 변경될 때마다 실행된다.
    // id가 변경 되었을 때 새로 데이터를 가져오는건데
    // id가 처음 값이 생성될 때(게시물 생성), id가 변경될 때 해당 게시물을 가져옴
    // -> 수정할 게시물을 가져와 주는거고, 수정한다고 해서 id가 변경되는건 X
    const getPost = async (id: string) => {
      if (id) {
        const docRef = doc(db, "posts", id);
        // 아이디에 해당하는 게시물을 상세페이지에 띄워야함
        // db이름이 posts인 doc를 가져와 id를 docRef에 저장

        const docData = await getDoc(docRef);
        // docRef - 아이디에 해당하는 doc를 가져와 docSnap에 저장

        setPost({
          id: docData.id,
          ...(docData?.data() as IPostsProps),
        });
      }
    };
    if (id) {
      // params의 id가 있다면 해당하는 id의 게시물 가져오기
      getPost(id); // getPost는 상세내용을 보기 위함, 수정 시, 그 내용을 default값으로 보이게 하기 위함
    }
  }, [id]);

  // useEffect의 무한 렌더링
  // useEffect는 어떻게 사용해야할까? (티스토리)
  //   useEffect(() => {
  //     상태 업데이트 로직
  // }, []);
  // 의존성 배열을 빈 배열로 설정하면 이 useEffect는 컴포넌트가 처음 렌더링될 때만 실행됩니다.

  useEffect(() => {
    // post가 변경이 될 때마다 useEffect를 실행
    // 그렇게 되면 다시 setPost를 실행하게 되어
    // 무한 렌더링이 발생된다.
    if (post) {
      // 수정하는 데이터가 담긴 post는
      // 수정하는 데이터를 담기 위함이지 변경해야할 form을 업데이트 해주지 않는다.
      // postList에서는 form 데이터를 토대로 렌더링중이기 때문
      // 무한 반복 수정을 하게 되는 것이기 때문에
      // setForm으로 변경!
      setForm({
        title: post?.title,
        contents: post?.contents,
        category: post?.category || "",
      });
    }
  }, [post]); // post가 변경될때 (수정할때)마다 form의 값을 수정한 내용으로 변경

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form__block">
        <label htmlFor="title">제목</label>
        <input
          type="text"
          name="title"
          id="title"
          onChange={onChange}
          defaultValue={form.title}
        />
      </div>
      <div className="form__block">
        <label htmlFor="category">카테고리</label>
        <select
          name="category"
          id="category"
          value={form.category}
          onChange={onChange}
        >
          <option value="">카테고리를 선택해주세요</option>
          <option value="Frontend">프론트엔드</option>
          <option value="Backend">백엔드</option>
          <option value="Web">웹</option>
          <option value="Native">앱</option>
        </select>
      </div>
      <div className="form__block">
        <label htmlFor="contents">내용</label>
        <textarea
          name="contents"
          id="contents"
          onChange={onChange}
          defaultValue={form.contents}
        />
      </div>
      <div className="form__block">
        <input
          type="submit"
          value={post ? "수정" : "제출"}
          className="form__btn--submit"
        />
      </div>
    </form>
  );
};

export default PostForm;
