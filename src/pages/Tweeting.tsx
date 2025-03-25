import { useAuth } from "../context/AuthContext";
import Feed from "./TweetFeed";
import PostForm from "./TweetForm";

const Tweeting = () => {
  const { user } = useAuth();
  return (
    <div className="bg-[#0f0f0f] text-gray-200 min-h-screen">
      <div className="sticky top-0 z-50 bg-[#121212] border-b border-gray-700 px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl text-center font-bold text-white tracking-wide">
            🗯️ DormTalk
          </h1>
          <h1 className="sm:text-2xl text-center font-bold text-white tracking-wide">
            Hi, {user?.name}
          </h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 pt-6 space-y-6">
        <PostForm />
        <Feed />
      </div>
    </div>
  );
};

export default Tweeting;
