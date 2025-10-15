import { Heart } from 'lucide-react';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Stack, Badge, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/myPage/myLikes.css';
import api from '../../config/apiConfig';
import { useNavigate } from 'react-router-dom';

const MyLikesList = () => {
  const [likes, setLikes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const navigate = useNavigate();
  const PAGE_SIZE = 5;

  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

  // 데이터 fetch
  const fetchMyLikes = useCallback(async (pageToFetch) => {
    if (loadingRef.current || !hasMoreRef.current) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/mypage/myLikes?page=${pageToFetch}&size=${PAGE_SIZE}`);
      const newLikes = res.data.data.myLikeList || [];
      console.log("newLikes : ", newLikes);
      

      setLikes(prev => {
        const existingIds = new Set(prev.map(like => like.postId));
        const filteredNew = newLikes.filter(like => !existingIds.has(like.postId));
        return [...prev, ...filteredNew];
      });

      setHasMore(!res.data.data.isLast);
    } catch (err) {
      console.error('좋아요 리스트 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 초기 fetch
  useEffect(() => { fetchMyLikes(1); }, [fetchMyLikes]);

  // 페이지 변경 시 fetch
  useEffect(() => {
    if (page === 1) return; // 초기 fetch와 중복 방지
    fetchMyLikes(page);
  }, [page, fetchMyLikes]);

  // IntersectionObserver 무한 스크롤
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sentinel = document.createElement('div');
    sentinel.className = 'scroll-sentinel';
    container.appendChild(sentinel);

    const options = { root: container, rootMargin: '0px', threshold: 1.0 };
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMoreRef.current && !loadingRef.current) {
        setPage(prev => prev + 1);
      }
    }, options);

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      container.removeChild(sentinel);
    };
  }, []);

  const handleClick = like => {
    const { postId, tableTypeCategory } = like;
    if (tableTypeCategory === '테일리프렌즈') navigate(`/taily-friends/${postId}`);
    else if (tableTypeCategory === '피드') navigate(`/feeds/${postId}`);
    else if (tableTypeCategory === '산책경로') navigate(`/walk-paths/${postId}`);
  };

  return (
    <div
      className='likes-list-container'
      ref={containerRef}
      style={{ maxHeight: '500px', overflowY: 'auto' }}
    >
      {likes.length === 0 && !loading && <p className='text-center'>아직 좋아요를 하지 않았어요</p>}

      {likes.map(like => (
        <Stack key={like.postId} gap={3} className='mt-2'>
          <Stack direction='horizontal' gap={3} className='p-3 border message-box bg-light align-items-center hover-effect'>
            <div className='d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm' style={{ width: 45, height: 45 }}>
              <Heart size={22} color='#ff4d6d' fill='#ff4d6d' />
            </div>
            <div className='flex-grow-1 clickable' onClick={() => handleClick(like)}>
              <div>
                <strong>{like.targetName}</strong>님의 <span className='fw-semibold'>게시글에 좋아요를 눌렀습니다.</span>
              </div>
            </div>
            <Badge className='table-type-category' bg='outline-primary'>{like.tableTypeCategory}</Badge>
          </Stack>
        </Stack>
      ))}

      {loading && <div className='text-center mt-3'><Spinner animation='border' size='sm' /> 나의 좋아요 리스트 정보를 불러오는 중...</div>}
      {!hasMore && likes.length > 0 && !loading && <p className='text-center mt-3 text-muted'>모든 좋아요를 불러왔어요.</p>}
    </div>
  );
};

export default MyLikesList;
