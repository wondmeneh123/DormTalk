import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { database } from "../config/firebase";

const ProfilePage = () => {
  const { uid } = useParams<{ uid: string }>();
  const [posts, setPosts] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      // Get user info
      const userRef = doc(database, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserInfo(userSnap.data());
      }

      // Get user posts
      const postQuery = query(
        collection(database, "posts"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc")
      );

      const postSnap = await getDocs(postQuery);
      const postData = postSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(postData);
      console.log(postData);
    };

    fetchData();
  }, [uid]);

  return (
    <div className="bg-[#0f0f0f] text-gray-200 min-h-screen">
      <div className="max-w-screen-xl   mx-auto  p-4 text-gray-200">
        {userInfo && (
          <div className="mb-8 text-center p-4">
            <img
              src={userInfo.avatar}
              alt="avatar"
              className="w-20 h-20 rounded-full mx-auto border-2 border-gray-600 shadow-sm"
            />
            <h2 className="text-4xl font-bold mt-3 text-white">
              {userInfo.name}
            </h2>
            <p className=" text-gray-400">{userInfo.email}</p>
          </div>
        )}

        <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
          Posts
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {posts.length === 0 && (
            <p className="text-center text-gray-500">No posts yet.</p>
          )}

          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-[#1a1a1a] border border-gray-700 p-4 rounded-lg shadow-sm"
            >
              <p className=" text-gray-100 whitespace-pre-wrap">
                {post.content.split(" ").map((word: any, idx: any) =>
                  word.startsWith("#") ? (
                    <span key={idx} className="text-blue-400 font-medium">
                      {word + " "}
                    </span>
                  ) : (
                    <span key={idx}>{word + " "}</span>
                  )
                )}
              </p>
              <div className="text-xs text-gray-500 mt-2">
                {post.createdAt?.toDate().toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
