import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

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
      // Firebase login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch additional user data from Firestore
      const userRef = doc(database, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        // Save to Context + localStorage (handled in AuthContext)
        setUser({
          uid: user.uid,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
        });

        alert("Login successful!");
      } else {
        alert("User data not found in Firestore.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.message || "Login failed");
    }
  };
  return (
    <form className="flex flex-col gap-2">
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 rounded"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="border p-2 rounded"
      />
      <button
        type="button"
        onClick={handleLogin}
        className="bg-green-600 text-white p-2 rounded"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
