// src/pages/LoginPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/auth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    login("dummy-token"); // 로그인 처리
    navigate("/main");
  };

  return (
    <div style={{ padding: 50 }}>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
