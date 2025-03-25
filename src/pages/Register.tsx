import { useState } from "react";
import { auth, database } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { AvatarGenerator } from "random-avatar-generator";

const Register = () => {
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

      alert("User registered successfully!");
    } catch (error: any) {
      console.error("Registration failed:", error);
      alert(error.message || "Registration error");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Register with Email</h2>
      <form className="flex flex-col gap-2">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
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
          onClick={handleRegister}
          className="bg-blue-600 text-white p-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
