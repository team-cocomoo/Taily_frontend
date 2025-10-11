import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import "../../styles/myPage/MyPetInfo.css";

const MyPetWriteInfoModal = ({ show, handleClose }) => {
    const [file, setFile] = useState(null);
    const [gender, setGender] = useState("여자");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = {
            name: event.target.name.value,
            gender,
            age: event.target.age.value,
            preference: event.target.preference.value,
            introduction: event.target.introduction.value,
            file,
        };

        console.log("작성 데이터:", formData);

        // TODO: API 호출로 업로드 처리
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>작성 페이지</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    {/* 이름 */}
                    <div className="mb-3">
                        <label className="form-label">이름</label>
                        <input type="text" name="name" className="form-control" placeholder="이름 입력" required />
                    </div>

                    {/* 성별 */}
                    <div className="mb-3">
                        <label className="form-label">성별</label>
                        <div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    value="암컷"
                                    checked={gender === "female"}
                                    onChange={handleGenderChange}
                                />
                                <label className="form-check-label">여자</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    value="수컷"
                                    checked={gender === "male"}
                                    onChange={handleGenderChange}
                                />
                                <label className="form-check-label">남자</label>
                            </div>
                        </div>
                    </div>

                    {/* 나이 */}
                    <div className="mb-3">
                        <label className="form-label">나이</label>
                        <input type="text" name="age" className="form-control" placeholder="예: 2살" required />
                    </div>

                    {/* 취향 */}
                    <div className="mb-3">
                        <label className="form-label">취향</label>
                        <input type="text" name="preference" className="form-control" placeholder="예: 개껌, 산책, 공놀이" />
                        <small className="form-text text-muted">쉼표(,)로 구분하여 입력</small>
                    </div>

                    {/* 소개글 */}
                    <div className="mb-3">
                        <label className="form-label">소개글</label>
                        <textarea name="introduction" className="form-control" rows="3" placeholder="소개글 입력"></textarea>
                    </div>

                    {/* 이미지 업로드 */}
                    <div className="mb-3">
                        <label className="form-label">이미지 업로드</label>
                        <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
                    </div>

                    {/* 이미지 미리보기 */}
                    {file && (
                        <div className="mb-3">
                            <img
                                src={URL.createObjectURL(file)}
                                alt="미리보기"
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                        </div>
                    )}

                    {/* 제출 버튼 */}
                    <Button variant="success" type="submit">
                        작성 완료
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default MyPetWriteInfoModal;
