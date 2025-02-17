import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { DocumentData, Query, QuerySnapshot, collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { AuthContext } from "context/AuthContext";

interface IPostList {
  hasNavigation?: boolean,
  defaultTap : TabType
}

export interface IPostsProps {
  id?: string,
  title: string,
  contents: string,
  email?: string,
  createAt?: string,
  uid: string,
  category? : CategoryType,
  comments? : ICommentsProps[], // 댓글들 배열
  // 타입 정리가 너무 안된다.. 다시 공부할 때 타입만 모아서 해야지
  // 왜 배열타입인지?
}

export interface ICommentsProps {
  contents: string,
  uid: string,
  email: string,
  createAt: string
}

export type CategoryType = "Frontend" | "Backend" | "Web" | "Native" | "";
export const CATEGORIES: CategoryType[] = [
  "Frontend",
  "Backend",
  "Web",
  "Native",
  ""
];

type TabType = "all" | "my";

const PostList = ({ hasNavigation, defaultTap }: IPostList) => {

  const {user} = useContext(AuthContext);

  const [posts, setPosts] = useState<IPostsProps[]>([]);

  const [activeTab, setActiveTab] = useState<TabType | CategoryType>(defaultTap);

  useEffect(() => {
    const getPostdata = async (): Promise<void> => {
      try {
        let postRef = collection(db, "posts");
        let postQuery : Query<DocumentData> | undefined;

        if(activeTab === "my" && user){
          // 필터링 : 나의 글만 가져오기
          postQuery = query(postRef, where("uid", "==", user?.uid), orderBy("createAt", "desc"));
        } else if (activeTab === "all") {
          // 모든 글 보여주기
          postQuery = query(postRef, orderBy("createAt", "desc"))
        } else {
           // 카테고리 글 보여주기
      postQuery = query(postRef, where("category", "==", activeTab),
        orderBy("createAt", "desc")
      );
        }

          // 백엔드 클릭했을 때 백엔드 게시물만 나오게끔 필터링 변경 -> query 색인 추가해야됑

         // 순서대로 날짜 순으로 정렬 orderBy : SQL의 쿼리문을 직접 사용 가능!
         
         if(postQuery){
         
         const datas: QuerySnapshot = await getDocs(postQuery);

        // const datas: QuerySnapshot = await getDocs(collection(db, "posts"));
        // QuerySnapshot : getDocs(collection(db, "posts"))을 반환하는 객체 타입
        // BUT 이 객체에는 문서 데이터의 배열을 직접 포함하지 않고 docs 속성 안에 데이터가 들어있다.
        // -> 실제 데이터를 꺼내 IPostProps 형태로 변환해야한다.
        const postList: IPostsProps[] = datas.docs.map((doc) => {
          // datas의 docs 속성 내에서 실제 데이터 꺼내기 doc.data()
          const data = doc.data();
          // firestore는 doc 단위로 객체를 저장 > data() 호출해서 객체 형태로 반환
          return {
            id: doc.id,
            uid: doc.id,
            title: doc.data().title || "", // data에서 title 필드 확인, 없으면 빈 문자열
            contents: data.contents || "", // contents 필드 확인
            email: data.email || "", // email 필드 확인
            createAt: data.createAt || "", // createAt 필드 확인
            category: data.category || ""
          };
        });
        setPosts(postList);
      }

      } catch (e: any) {
        console.log(e);
      }
    };
    getPostdata();
  }, [activeTab]);


  return (
    <div>
      {hasNavigation && (
        <div className="post__navigation">
          <div
            onClick={() => setActiveTab("all")}
            role="presentation"
            className={activeTab === "all" ? "post__navigation--active" : ""}
          >
            전체
          </div>
          <div
            onClick={() => setActiveTab("my")}
            role="presentation"
            className={activeTab === "my" ? "post__navigation--active" : ""}
          >
            나의 글
          </div>
          {CATEGORIES?.map((category) => (
            <div
              key={category}
              role="presentation"
              onClick={() => setActiveTab(category)}
              className={
                activeTab === category ? "post__navigation--active" : ""
              }
            >
              {category}
            </div>
          ))}
        </div>
      )}
      <div className="post__list">
        {posts?.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post__box">
              <Link to={`/posts/${post?.id}`}>
                <div className="post__profile-box">
                  <div className="post__profile"></div>
                  <div className="post__author-name">사용자</div>
                  <div className="post__date">{post?.createAt}</div>
                </div>
                <div className="post__title">{post?.title}</div>
                <div className="post__text">{post?.contents}</div>
                <div className="post__text">{post?.category}</div>
              </Link>
            </div>
          ))
        ) : (
          <div className="post__no-post">게시물이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default PostList;
