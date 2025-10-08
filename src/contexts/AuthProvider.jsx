// src/contexts/AuthContext.jsx
import React, { useState, useEffect } from "react";
import api from "../config/apiConfig";
import { AuthContext } from "./AuthContext"; // ✅ import 추가

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 페이지 로드 시 토큰이 있으면 사용자 정보 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (err) {
        console.error("유저 정보 가져오기 실패:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
