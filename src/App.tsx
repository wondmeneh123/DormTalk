import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Tweeting from "./pages/Tweeting";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:uid" element={<ProfilePage />} />
          <Route path="/" element={<ProtectedRoute />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Tweeting /> : <Login />;
};

export default App;
