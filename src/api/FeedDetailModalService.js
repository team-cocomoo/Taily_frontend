// src/services/feed/FeedDetailModalService.js
import api from "@/config/apiConfig";

/** 피드 상세 조회 (feedData가 없을 때만 사용) */
export async function fetchFeedDetail(feedId) {
  const res = await api.get(`/api/feeds/${feedId}`);
  return res.data.data || res.data;
}

/** 댓글 목록 조회 */
export async function fetchComments(feedId) {
  const res = await api.get(`/api/feeds/${feedId}/comments?page=1&size=50`);
  return res.data.data?.content || [];
}

/** 댓글 등록 */
export async function createComment(feedId, content) {
  const res = await api.post(`/api/feeds/${feedId}/comments`, { content });
  return res.data.data;
}

/** 대댓글 등록 */
export async function createReply(feedId, parentId, content) {
  const res = await api.post(
    `/api/feeds/${feedId}/comments/${parentId}/reply`,
    {
      content,
    }
  );
  return res.data.data;
}

/** 댓글 삭제 */
export async function deleteComment(feedId, commentId) {
  await api.delete(`/api/feeds/${feedId}/comments/${commentId}`);
}

/** 댓글 수정 */
export async function updateComment(feedId, commentId, content) {
  const res = await api.patch(`/api/feeds/${feedId}/comments/${commentId}`, {
    content,
  });
  return res.data.data;
}

/** 좋아요 토글 */
export async function toggleLike(feedId) {
  const tableTypeId = 3; // Feed 게시판 ID
  const res = await api.post(`/api/likes/${tableTypeId}/${feedId}`);
  return res.data.data; // { liked, likeCount }
}

/** 로그인 유저 조회 */
export async function fetchCurrentUser() {
  const res = await api.get("/api/mypage/me");
  return res.data;
}
