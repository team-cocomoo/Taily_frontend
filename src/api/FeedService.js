import api from "@/config/apiConfig"; // axios 인스턴스 사용

const API_BASE = "/api/feeds";
/**
 * 피드 전체 목록 조회 (무한 스크롤용)
 * @param {number} page - 페이지 번호
 * @param {number} size - 한 페이지당 아이템 수
 * @returns {Promise}
 */
export const getFeeds = (page = 0, size = 10) =>
  api.get(`${API_BASE}?page=${page}&size=${size}`);

/**
 * 피드 단일 조회 (이미지 포함)
 * @param {number} feedId - 피드 ID
 * @returns {Promise}
 */
export const getFeed = (feedId) => api.get(`${API_BASE}/${feedId}`);

/**
 * 피드 작성 (이미지 업로드 포함)
 * @param {FormData} formData - 피드 등록 데이터
 * @returns {Promise}
 */
export const createFeed = (formData) =>
  api.post(`${API_BASE}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * 피드 수정
 * @param {number} feedId - 피드 ID
 * @param {FormData} formData - 수정할 데이터
 * @returns {Promise}
 */
export const updateFeed = (feedId, formData) =>
  api.put(`${API_BASE}/${feedId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * 피드 삭제
 * @param {number} feedId - 피드 ID
 * @returns {Promise}
 */
export const deleteFeed = (feedId) => api.delete(`${API_BASE}/${feedId}`);

/**
 * 좋아요 토글
 * @param {number} feedId - 피드 ID
 * @returns {Promise}
 */
export const toggleLike = (feedId) => api.post(`${API_BASE}/${feedId}/like`);
