// src/contexts/AuthContext.jsx
import React, { useState, useEffect } from "react";
import api from "../config/apiConfig";
import { AuthContext } from "./AuthContext"; // import 추가

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
        const res = await api.get("/api/users/me");
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

  // 로그아웃 함수 추가
  const logout = async () => {
    try {
      // 서버 로그아웃 (JWT 블랙리스트 등록)
      await api.post("/api/users/logout");
    } catch (err) {
      console.warn("서버 로그아웃 실패:", err);
    } finally {
      // 로컬 토큰 삭제
      localStorage.removeItem("token");
      // 사용자 상태 초기화
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
