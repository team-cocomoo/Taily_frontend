// src/api/FeedService.js
import api from "@/config/apiConfig";

const API_BASE = "/api/feeds";
const IMAGE_API = "/api/images";

/**
 * 피드 전체 목록 조회 (무한 스크롤용)
 * @param {number} page - 페이지 번호
 * @param {number} size - 한 페이지당 아이템 수
 * @returns {Promise<Page<FeedResponseDto>>}
 */
export const getFeeds = (page = 0, size = 10) =>
  api.get(`${API_BASE}?page=${page}&size=${size}`);

/**
 * 피드 단일 조회 (이미지 + 태그 포함)
 * @param {number} feedId - 피드 ID
 * @returns {Promise<FeedResponseDto>}
 */
export const getFeed = (feedId) => api.get(`${API_BASE}/${feedId}`);

/**
 * 피드 등록
 * 이미지 업로드 후 filePath만 포함한 JSON 전송
 * @param {object} feedData - { content, tags, imagePaths, tableTypeId }
 * @returns {Promise<FeedResponseDto>}
 */
export const createFeed = (feedData) => api.post(API_BASE, feedData);

/**
 * 피드 수정
 * 기존 이미지 유지 + 새 이미지 경로 병합 가능
 * @param {number} feedId - 수정할 피드 ID
 * @param {object} feedData - { content, tags, imagePaths }
 * @returns {Promise<FeedResponseDto>}
 */
export const updateFeed = (feedId, feedData) =>
  api.put(`${API_BASE}/${feedId}`, feedData);

/**
 * 피드 삭제
 * @param {number} feedId - 피드 ID
 * @returns {Promise<void>}
 */
export const deleteFeed = (feedId) => api.delete(`${API_BASE}/${feedId}`);

/**
 * 좋아요 토글
 * @param {number} feedId - 피드 ID
 * @returns {Promise<{likeCount: number}>}
 */
export const toggleLike = (feedId) => api.post(`${API_BASE}/${feedId}/like`);

// --------------------- 이미지 관련 ---------------------

/**
 * 이미지 업로드
 * @param {File[]} files - 업로드할 파일 리스트
 * @param {string} subFolder - 저장 폴더명 (기본값: "feed")
 * @param {number} tableTypesId - 기능 구분 ID (피드=3)
 * @param {number|null} postsId - 연관 게시물 ID (수정 시 필요)
 * @returns {Promise<Array<{ id: number, filePath: string }>>}
 */
export const uploadImages = async (
  files,
  subFolder = "feed",
  tableTypesId = 3,
  postsId = null
) => {
  const formData = new FormData();
  formData.append("tableTypesId", tableTypesId);
  formData.append("subFolder", subFolder);
  if (postsId) formData.append("postsId", postsId);

  files.forEach((file) => formData.append("files", file));

  const res = await api.post(`${IMAGE_API}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data; // [{ id, filePath }, ...]
};

/**
 * 이미지 조회
 * @param {number} tableTypesId - 예: 3 (feed)
 * @param {number|null} usersId - 유저 ID (프로필 조회 시 사용)
 * @param {number|null} postsId - 게시물 ID (피드 이미지 조회 시 사용)
 * @returns {Promise<Array<{ id: number, filePath: string }>>}
 */
export const getImages = async (
  tableTypesId,
  usersId = null,
  postsId = null
) => {
  const params = new URLSearchParams({ tableTypesId });
  if (usersId) params.append("usersId", usersId);
  if (postsId) params.append("postsId", postsId);

  const res = await api.get(`${IMAGE_API}?${params.toString()}`);
  return res.data;
};

/**
 * 이미지 삭제
 * @param {number} tableTypesId - 예: 3 (feed)
 * @param {number|null} usersId - 유저 ID
 * @param {number|null} postsId - 게시물 ID
 * @returns {Promise<string>} - "이미지 삭제 완료"
 */
export const deleteImages = async (
  tableTypesId,
  usersId = null,
  postsId = null
) => {
  const params = new URLSearchParams({ tableTypesId });
  if (usersId) params.append("usersId", usersId);
  if (postsId) params.append("postsId", postsId);

  const res = await api.delete(`${IMAGE_API}/delete?${params.toString()}`);
  return res.data; // "이미지 삭제 완료"
};
