import { useState } from "react";
import { auth, database } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { AvatarGenerator } from "random-avatar-generator";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const generator = new AvatarGenerator();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { email, password, name } = formData;
    if (!email || !password || !name) {
      alert("Please fill all fields");
      return;
    }

    try {
      // Register with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Generate avatar
      const avatarUrl = generator.generateRandomAvatar();

      // Save user to Firestore
      const userRef = doc(database, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name,
        email,
        avatar: avatarUrl,
        createdAt: new Date().toISOString(),
      });

      navigate("/");
    } catch (error: any) {
      console.error("Registration failed:", error);
      alert(error.message || "Registration error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a]  border-gray-700 p-6  w-full max-w-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Register
        </h2>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          autoFocus
          className="w-full mb-3 px-4 py-2 bg-[#0f0f0f] border border-gray-600 rounded text-sm text-white"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-3 px-4 py-2 bg-[#0f0f0f] border border-gray-600 rounded text-sm text-white"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 bg-[#0f0f0f] border border-gray-600 rounded text-sm text-white"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
