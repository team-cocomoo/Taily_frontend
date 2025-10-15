import { Heart } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
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
    const navigate = useNavigate();
    const PAGE_SIZE = 5; // 서버 요청 size와 맞추기

    // 무한 스크롤
    const fetchMyLikes = useCallback(async (pageToFetch) => {
    if (loading || !hasMore) return; // 조건 체크는 여기서만

    setLoading(true);
    try {
        const response = await api.get(`/api/mypage/myLikes?page=${pageToFetch}&size=5`);
        console.log("서버 응답:", response.data);

        const newLikes = response.data.data.myLikeList || [];
        setLikes(prev => [...prev, ...newLikes]);
        // hasMore 판단: 받아온 데이터가 PAGE_SIZE보다 작으면 마지막 페이지
            setHasMore(newLikes.length === PAGE_SIZE);

    } catch (error) {
        console.error("내가 좋아요한 게시글 리스트 조회 실패:", error);
    } finally {
        setLoading(false);
    }
    // 의존성 제거
}, []); 

// 페이지 변경될 때 호출
useEffect(() => {
    fetchMyLikes(page);
}, [page]);

    useEffect(() => {
    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
            !loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, [loading, hasMore]);

    const handleClick = (like) => {
        const { postId, tableTypeCategory } = like;

        if (tableTypeCategory === "테일리프렌즈") {
            navigate(`/taily-friends/${postId}`);
        } else if (tableTypeCategory === "피드") {
            navigate(`/feeds/${postId}`);
        } else if (tableTypeCategory === "산책경로") {
            navigate(`/walk-paths/${postId}`);
        } else {
            console.warn("Unknown category:", tableTypeCategory);
        }
    };

    return (
        <>
            <div className='likes-list-container'>
                {likes.length === 0 && !loading && (
                <p className="text-center">아직 좋아요를 하지 않았어요</p>
            )}

                {likes.slice().reverse().map((like, index) => (
                    <Stack key={index} gap={3} className='mt-2'>
                        <Stack
                            direction='horizontal'
                            gap={3}
                            className='p-3 border message-box bg-light align-items-center hover-effect'
                        >
                            <div className="d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm" style={{ width: 45, height: 45 }}>
                                <Heart size={22} color='#ff4d6d' fill='#ff4d6d' />
                            </div>

                            <div className='flex-grow-1 clickable' onClick={() => handleClick(like)}>
                                <div>
                                    <strong>{like.targetName}</strong>님의 {" "}
                                    <span className="fw-semibold">게시글에 좋아요를 눌렀습니다.</span>
                                </div>
                            </div>
                            <Badge className='table-type-category' bg="outline-primary">
                                {like.tableTypeCategory}
                            </Badge>
                        </Stack>
                    </Stack>
                ))}

                {loading && (
                                <div className="text-center mt-3">
                                    <Spinner animation="border" size="sm" /> 나의 좋아요 리스트 정보를 불러오는 중...
                                </div>
                            )}

                {!hasMore && !loading && (
                    <p className='text-center mt-3 text-muted'>모든 좋아요를 불러왔어요.</p>
                )}

            </div>
        </>
    );
};

export default MyLikesList;