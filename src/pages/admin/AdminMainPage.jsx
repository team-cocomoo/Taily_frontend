import React from 'react';
import { Container } from 'react-bootstrap';

const adminPage = () => {
    // const [selectedMenu, setSelectedMenu] = useState('searchUser'); // 기본 '회원 관리'
    
    return (
        <div>
            <Header>Taily Admin Service</Header>
            <h1>관리자 테스트 페이지</h1>
            <p>여기는 로그인 없이 URL로 접근 가능한 임시 관리자 페이지입니다.</p>
        </div>
    );
};

export default adminPage;