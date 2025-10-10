import React from "react";
import { Card, Row, Col, Table, Dropdown } from "react-bootstrap";
import profileImage from "../../assets/image/calendar-paw.png";
import meatballIcon from "../../assets/image/meatball-icon.png";
import "../../styles/myPage/MyPetInfo.css"; // 스타일 분리

const MyPetInfoCard = () => {
    const petInfo = {
        name: "뽀삐",
        gender: "암컷",
        age: "2살",
        preference: ["개껌", "산책", "공놀이"],
        introduction: "활동적이고 옷 입는 걸 좋아해요",
    };

    return (
        <Card className="profile-box mt-5 p-3" style={{ maxWidth: "600px", margin: "auto" }}>
    <Row>
        <Col sm={4} className="d-flex justify-content-center align-items-center">
            <img
                src={profileImage}
                alt="pet"
                style={{ width: "100%", borderRadius: "10px" }}
            />
        </Col>
        <Col sm={8} style={{ position: "relative" }}>
            {/* 드롭다운을 카드 상단 오른쪽에 위치 */}
            <Dropdown className="profile-dropdown mx-4" style={{ position: "absolute", top: 0, right: 0 }}>
                <Dropdown.Toggle variant="light" id="dropdown-basic" size="sm" className="no-caret">
                    <img src={meatballIcon} alt="메뉴" className="meatballIcon" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => alert("수정")}>수정</Dropdown.Item>
                    <Dropdown.Item onClick={() => alert("삭제")}>삭제</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <Table borderless>
                <tbody>
                    <tr>
                        <td><strong>이름</strong></td>
                        <td>{petInfo.name}</td>
                    </tr>
                    <tr>
                        <td><strong>성별</strong></td>
                        <td>{petInfo.gender}</td>
                    </tr>
                    <tr>
                        <td><strong>나이</strong></td>
                        <td>{petInfo.age}</td>
                    </tr>
                    <tr>
                        <td><strong>취향</strong></td>
                        <td>{petInfo.preference.join(", ")}</td>
                    </tr>
                    <tr>
                        <td><strong>소개글</strong></td>
                        <td>{petInfo.introduction}</td>
                    </tr>
                </tbody>
            </Table>
        </Col>
    </Row>
</Card>
    );
};

export default MyPetInfoCard;
