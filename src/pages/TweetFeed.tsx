import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { database } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

type Post = {
  id: string;
  uid: string;
  content: string;
  name: string;
  avatar: string;
  createdAt: any;
  hashtags: string[];
  reactions?: {
    like: number;
    laugh: number;
  };
};

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);

  useEffect(() => {
    let q;

    if (selectedHashtag) {
      q = query(
        collection(database, "posts"),
        where("hashtags", "array-contains", selectedHashtag),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(collection(database, "posts"), orderBy("createdAt", "desc"));
    }

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(data);
    });

    return () => unsub();
  }, [selectedHashtag]);

  const handleReaction = async (postId: string, type: "like" | "laugh") => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const postRef = doc(database, "posts", postId);
    const currentCount = post.reactions?.[type] || 0;

    const newReactions = {
      ...post.reactions,
      [type]: currentCount + 1,
    };

    await updateDoc(postRef, { reactions: newReactions });
  };

  return (
    <div className="space-y-4">
      {selectedHashtag && (
        <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing posts with <strong>{selectedHashtag}</strong>
          </span>
          <button
            onClick={() => setSelectedHashtag(null)}
            className="text-blue-600 hover:underline"
          >
            Clear Filter
          </button>
        </div>
      )}

      {posts.map((post) => (
        <div key={post.id} className="border p-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <Link
              to={`/profile/${post.uid}`}
              className="flex items-center gap-2 mb-2"
            >
              <img
                src={post.avatar}
                className="w-8 h-8 rounded-full"
                alt="avatar"
              />
              <span className="font-semibold hover:underline">{post.name}</span>
            </Link>
            <span className="font-semibold">{post.name}</span>
            <span className="text-sm text-gray-500">
              {post.createdAt?.toDate().toLocaleString()}
            </span>
          </div>

          {/* Content with clickable hashtags */}
          <p className="text-sm whitespace-pre-wrap">
            {post.content.split(" ").map((word, idx) =>
              word.startsWith("#") ? (
                <button
                  key={idx}
                  className="text-blue-600 font-medium hover:underline"
                  onClick={() => setSelectedHashtag(word)}
                >
                  {word + " "}
                </button>
              ) : (
                <span key={idx}>{word + " "}</span>
              )
            )}
          </p>

          <div className="flex gap-4 mt-3 text-sm">
            <button onClick={() => handleReaction(post.id, "like")}>
              ❤️ {post.reactions?.like || 0}
            </button>
            <button onClick={() => handleReaction(post.id, "laugh")}>
              😂 {post.reactions?.laugh || 0}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
