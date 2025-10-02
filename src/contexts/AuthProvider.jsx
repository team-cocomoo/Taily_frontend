import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext"; // Context import

// AuthProviderProvider 컴포넌트 - 실제 인증 상태를 관리하고 제공
export const AuthProvider = ({ children }) => {
  // 인증 상태 관리
  const [user, setUser] = useState(null); // 로그인한 사용자 정보
  const [loading, setLoading] = useState(true); // 초기 로딩 상태
  // 위 loading 정보는 초기 로딩 상태를 관리하기 위함
  // loading 상태는 앱이 Localstorage 에서 사용자 인증 정보를 확인하고 복원하는 비동기 작업이
  // 완료했는지 여부를 저장, loading 상태를 관리하지 않는다면 처음에는 user(인증정보) 가
  // null 이므로 앱이 사용자에게 로그아웃된 화면을 보여주다가 useEffect 실행 후 user 정보가 발견되면
  // 갑자기 로그인된 화면으로 바뀌는 상왕이 벌어질 수도 있음

  // 앱시작시 localStorage 에서 사용자 인증 정보 복원
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false); // 사용자 인증 정보를 로딩했으므로 로딩 상태가 아님을 알림
  }, []); // 의존성 빈 배열이므로 마운트시에 한 번 실행

  // 로그인 처리 - 사용자 정보 저장
  // 사용자 정보를 상태(state)에 설정하고 로컬 저장소(localStorage)에 저장하는 로그인(login) 과정을 담당
  const login = (userData) => {
    setUser(userData); // 모두가 공유하는 React Context에 인증 사용자 정보를 저장 -> 리렌더링
    // 로컬 스토리지에 사용자 정보를 저장한다, json 회원 객체를 문자열로 변환해 로컬 스토리지에 저장
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 로그아웃 처리 - 모든 정보 제거
  // 사용자 상태(state)를 초기화하고 로컬 저장소에서 인증 정보(token, user)를 제거하는 로그아웃(logout) 과정을 담당
  const logout = () => {
    setUser(null); // React Context user 상태가 변하므로 자식 컴포넌트 모두가 리렌더링
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Context로 제공할 값
  const value = {
    user, // 사용자 인증정보
    loading, // 사용자 인증 정보 로딩 상태
    login, // 로그인 처리 함수
    logout, // 로그아웃 처리 함수
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
