// src/api/UserService.js
import api from "@/config/apiConfig";

/**
 * UserService
 * 회원 관련 API 모듈
 */
const UserService = {
  /** 회원가입 요청 */
  register: async (formData) => {
    const response = await api.post("/api/users/register", {
      username: formData.username,
      nickname: formData.nickname,
      password: formData.password,
      tel: formData.tel,
      email: formData.email,
      address: formData.address,
    });
    return response.data;
  },

  /** ID 중복확인 */
  checkUsername: async (username) => {
    const response = await api.get("/api/auth/check-username", {
      params: { username },
    });
    return response.data; // true: 중복, false: 사용 가능
  },

  /** 닉네임 중복확인 */
  checkNickname: async (nickname) => {
    const response = await api.get("/api/auth/check-nickname", {
      params: { nickname },
    });
    return response.data;
  },

  /** 이메일 중복확인 */
  checkEmail: async (email) => {
    const response = await api.get("/api/auth/check-email", {
      params: { email },
    });
    return response.data;
  },
};

export default UserService;
