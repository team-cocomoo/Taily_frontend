// src/pages/MyPageUserInfo.js
import React, { useState } from 'react';
import { 
    Container, 
    Row, 
    Col, 
    Card, 
    Button, 
    Image 
} from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons'; 

// 분리된 컴포넌트 임포트
import MyPageSidebarNav from '../../components/mypage/MyPageSidebarNav';
import UserInfoDisplay from '../../components/mypage/UserInfoDisplay';
import MyPetInfoCard from '../../components/mypage/MyPetInfoCard';

// 사용자 정보 (실제로는 부모 컴포넌트에서 prop으로 전달되거나 Context/Redux를 통해 관리됩니다)
const userInfo = {
    nickname: '앙앙아니고양이',
    id: 'Lamb0123',
    tel: '010-1111-2332',
    email: 'tmtn123@gmail.com',
    address: '서울특별시 금천구 독산동',
    intro: '취미와 특성을 잘 표현해 줍니다.',
    birthday: '1995-05-15', 
};

const MyPageUserInfo = () => {
  const [selectedMenu, setSelectedMenu] = useState('me'); // 기본 '내정보'

    return (
        // 헤더와 푸터 사이에 들어갈 주 콘텐츠 영역.
        // Container를 사용하여 전체 너비를 제한하고 중앙 정렬합니다.
        <Container className="my-5"> 
            <Row>
                <Col md={12}>
                    <Card className="p-4 border rounded-4 shadow-sm">
                        
                        {/* 1. 사용자 프로필 영역 (닉네임과 프로필 사진) */}
                        <div className="d-flex align-items-center mb-4">
                            <div className="position-relative me-4">
                                <Image 
                                    src="profile-placeholder.jpg" 
                                    alt="프로필 이미지" 
                                    roundedCircle 
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', border: '2px solid #ffc107' }}
                                />
                                {/* 프로필 사진 수정 아이콘 */}
                                <Button 
                                    variant="light" 
                                    size="sm" 
                                    className="rounded-circle position-absolute bottom-0 end-0"
                                    style={{ width: '30px', height: '30px', padding: '0px' }}
                                >
                                    <PencilFill size={14} />
                                </Button>
                            </div>
                            <h2 className="mb-0 fw-bold">{userInfo.nickname}</h2>
                            {/* 닉네임 수정 아이콘 */}
                            <Button variant="link" className="text-dark ms-2">
                                <PencilFill size={16} />
                            </Button>
                        </div>

                        {/* 2. 메인 레이아웃 (사이드바 + 정보 표시) */}
                        <Row>
                            {/* 2-1. 사이드바 (메뉴) 영역: 3/12 너비 */}
                            <Col md={3} className="border-end pe-4">
                                <MyPageSidebarNav
                                    selectedMenu={selectedMenu}
                                    setSelectedMenu={setSelectedMenu}
                                />
                            </Col>

                            {/* 2-2. 사용자 정보 표시 영역: 9/12 너비 */}
                            <Col md={9} className="ps-4">
                                {selectedMenu === 'me' && <UserInfoDisplay userInfo={userInfo} />}
                                {selectedMenu === 'my-pets' && <MyPetInfoCard setSelectedMenu={setSelectedMenu} />}
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MyPageUserInfo;