import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import bg from "../assets/loginBg.png";
const Login = () => {
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { email, password } = formData;
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userRef = doc(database, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        setUser({
          uid: user.uid,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
        });
      } else {
        alert("User data not found in Firestore.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.message || "Login failed");
    }
  };
  return (
    <div
      className="min-h-screen  text-gray-200 flex items-center  flex-col justify-center p-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <h2 className="text-5xl font-bold text-center mb-6 text-white">
        DormTalk
      </h2>
      <div className="bg-[#1a1a1a] border border-gray-700 p-6 flex w-full max-w-xl shadow-lg">
        <div className="">
          <h1 className="text-2xl mb-3">Login to your account!</h1>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full mb-3 px-4 py-2 bg-[#0f0f0f] border border-gray-600 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full mb-4 px-4 py-2 bg-[#0f0f0f] border border-gray-600 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            Log In
          </button>
          <div className="mt-6 text-center w-full">
            New to DormTalk?{" "}
            <Link to="/register" className=" text-blue-700 ">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
