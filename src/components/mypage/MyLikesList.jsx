import { Heart } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Stack, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/myPage/myLikes.css';
import api from '../../config/apiConfig';
import { useNavigate } from 'react-router-dom';

const MyLikesList = () => {
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyLikes = async () => {
            try {
                const response = await api.get("/api/mypage/myLikes");
                if (response.data.data) {
                    setLikes(response.data.data);
                    console.log("response.data.data", response.data.data);
                }

            } catch (error) {
                console.error("내가 좋아요한 게시글 리스트 조회 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyLikes();
    }, []);

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

    if (loading) return <p>나의 좋아요 리스트 정보를 불러오는 중...</p>
    
    return (
        <>
            <div className='likes-list-container'>
                {likes.length === 0 ? (
                    <p className="text-center">아직 좋아요를 하지 않았어요</p>
                ) : (
                    likes.slice().reverse().map((like, index) => (

                        <Stack key={index} gap={3} className='mt-2'>
                            <Stack
                                direction='horizontal'
                                gap={3}
                                className='p-3 border message-box bg-light align-items-center hover-effect'
                                
                            >
                                {/* 아이콘 */}
                                <div className="d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm" style={{ width: 45, height: 45 }}>
                                    <Heart size={22} color='#ff4d6d' fill='#ff4d6d' />
                                </div>

                                {/* 텍스트 영역 */}
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
                    ))
                )}
            </div>
        </>
    );
};

export default MyLikesList;