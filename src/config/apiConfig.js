// config/apiConfig.js
import axios from "axios";
/*
    ajax 를 위한 axios interceptor 를 구성
    axios interceptor 는 프론트 리액트의 모든 request 와 response 를 가로채어서 공통 업무를 적용하는 역할을 함
    공통 업무란 request 시에 request message header에
                content-type : application/json 을 명시하고
                Authorization name에 JWT 토큰 정보를 저장해서 함께 전송하는 공통 업무
                또한 response 시에 401(인증에러) 또는 403(인가 or 권한에러) 에러 발생시
                localStorage 에 token 과 user를 삭제하고 로그인 페이지로 이동시키는 공통 업무
*/

// 1. axios 인스턴스 생성 및 설정
const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // 쿠키/세션도 필요하면 유지
});
// 2. request 요청 인터셉터 설정
/*
    요청 인터셉터 - API 호출 직전에 가로채서 공통 로직(JWT 토큰 추가)을 추가합니다.
    api.interceptors.request.use();
    구체적으로는 아래와 같음
    api.interceptors.request.use((config) => {성공처리},(error) => {실패처리})
*/
api.interceptors.request.use(
  (config) => {
    // 요청이 API 서버에 전달되기 직전에 실행, LocalStorage 에서 JWT 토큰을 가져와
    // http request header 에 Authorization 이름으로 JWT를 추가
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // config 객체를 전달
  },
  (error) => {
    return Promise.reject(error);
  } // 오류를 프로미스 객체로 반환해서 API 호출
  // 코드의 catch 블록으로 전달
);
/*
    response 응답 인터셉터 - http response status error code 401 인증 / 403 인가 에러 처리
    성공함수는 그대로 반환
    실패함수는 공통기능을 적용
*/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response.status;
    // 401 또는 403 에러 상태에 대한 공통 로직
    if (status === 401 || status === 403) {
      console.log("인증/인가 Error(401/403). Redirecting to login");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // 인증/인가 오류시에는 로그인페이지로 이동시킨다.
    }
    return Promise.reject(error); // API 실행코드의 catch가 실행되도록 한다 java 의 throw new XXXEXception() 과 유사
  }
);

export default api;
