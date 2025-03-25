import { useState, useRef } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { database } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import EmojiPicker, { Theme } from "emoji-picker-react";

const PostForm = () => {
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const charLimit = 280;

  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const extractHashtags: any = (text: string) => {
    return text.match(/#[a-zA-Z0-9_]+/g) || [];
  };

  const handlePost = async () => {
    if (!user || !content.trim()) return;

    const hashtags = extractHashtags(content);

    await addDoc(collection(database, "posts"), {
      uid: user.uid,
      name: user.name,
      avatar: user.avatar,
      content,
      hashtags,
      reactions: { like: 0, laugh: 0 },
      createdAt: serverTimestamp(),
    });

    setContent("");
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiData: any) => {
    const emoji = emojiData.emoji;
    const textarea = textareaRef.current;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = content.slice(0, start) + emoji + content.slice(end);
    setContent(newText);

    // Move cursor position after emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  return (
    <div className="sm:bg-[#1a1a1a] sm:border border-gray-700 sm:p-4 rounded-lg shadow mb-4 text-gray-200">
      <textarea
        ref={textareaRef}
        className="w-full p-3 rounded-lg bg-[#0f0f0f] text-white border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        rows={4}
        placeholder="What's happening?"
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, charLimit))}
      />

      <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
        <span>{charLimit - content.length} characters left</span>
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="hover:text-yellow-400 transition"
        >
          {showEmojiPicker ? "Hide Emojis 😅" : "Add Emoji 😊"}
        </button>
      </div>

      {showEmojiPicker && (
        <div className="mt-2 bg-[#0f0f0f] border border-gray-700 rounded-lg p-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.DARK} />
        </div>
      )}

      <button
        onClick={handlePost}
        disabled={!content.trim()}
        className={`mt-4 px-4 py-2 rounded-lg text-white font-medium transition ${
          content.trim()
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        Post
      </button>
    </div>
  );
};

export default PostForm;
