import React, { useState } from "react";
import { Accordion, Pagination } from "react-bootstrap";

const FaqList = () => {
    const faqs = [
        { q: "상욱님은 요즘 랜덤 돌리기를 왜 안하나요?", a: "글쎄요." },
        { q: "회원가입은 어떻게 하나요?", a: "홈페이지 상단의 회원가입 버튼을 클릭해 절차에 따라 진행하시면 됩니다." },
        { q: "로그인이 안돼요.", a: "아이디 또는 비밀번호를 다시 확인하시거나, 비밀번호 찾기 기능을 이용해주세요." },
        { q: "비밀번호를 잊어버렸어요.", a: "로그인 페이지에서 ‘비밀번호 찾기’를 클릭하여 재설정할 수 있습니다." },
        { q: "아이디를 변경할 수 있나요?", a: "아이디는 변경이 불가능합니다. 새 계정을 생성해 주세요." },
        { q: "회원 탈퇴는 어디서 하나요?", a: "마이페이지 > 회원정보 수정 메뉴에서 회원 탈퇴를 진행할 수 있습니다." },
        { q: "탈퇴 후에도 정보가 남아있나요?", a: "관련 법령에 따라 일정 기간 동안 일부 정보는 보관될 수 있습니다." },
        { q: "프로필 사진을 변경하고 싶어요.", a: "마이페이지에서 프로필 편집을 눌러 이미지를 변경할 수 있습니다." },
        { q: "닉네임을 바꿀 수 있나요?", a: "마이페이지에서 닉네임 변경 기능을 이용할 수 있습니다." },
        { q: "앱에서도 이용 가능한가요?", a: "현재는 웹에서만 이용 가능하며, 앱은 준비 중입니다." },
        { q: "이메일 인증이 안돼요.", a: "스팸함을 확인해보시고, 이메일이 오지 않았다면 다시 요청해주세요." },
        { q: "비밀번호 변경은 어떻게 하나요?", a: "마이페이지 > 계정 설정에서 비밀번호를 변경할 수 있습니다." },
        { q: "로그인 유지 기능이 있나요?", a: "로그인 시 ‘자동 로그인’ 옵션을 선택하시면 유지됩니다." },
        { q: "게시글은 어떻게 작성하나요?", a: "로그인 후, 펫스토리 메뉴에서 글쓰기 버튼을 눌러 작성할 수 있습니다." },
        { q: "사진은 몇 장까지 업로드할 수 있나요?", a: "한 게시글당 최대 10장까지 업로드 가능합니다." },
        { q: "다른 사람의 글에 댓글을 달 수 있나요?", a: "로그인한 회원은 누구나 댓글을 작성할 수 있습니다." },
        { q: "신고 기능은 어디에 있나요?", a: "각 게시글 또는 댓글 우측 상단의 ‘⋮’ 버튼을 눌러 신고할 수 있습니다." },
        { q: "관리자에게 직접 문의하고 싶어요.", a: "고객센터 > 문의하기를 통해 1:1 문의를 남기실 수 있습니다." },
        { q: "이벤트 참여는 어떻게 하나요?", a: "이벤트 페이지에서 참여하기 버튼을 클릭하시면 됩니다." },
        { q: "공지사항은 어디서 볼 수 있나요?", a: "고객센터 > 공지사항 메뉴에서 확인할 수 있습니다." },
    ];

    // 한 페이지 당 보여줄 개수
    const itemsPerPage = 5;
    const totalPages = Math.ceil(faqs.length / itemsPerPage);

    // 현재 페이지 상태
    const [currentPage, setCurrentPage] = useState(1);

    // 현재 페이지 데이터 계산
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentFaqs = faqs.slice(startIndex, startIndex + itemsPerPage);

    // 페이지 클릭 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    return (
        <>
            <Accordion defaultActiveKey="0">
                {currentFaqs.map((faq, index) => (
                    <Accordion.Item eventKey={index.toString()} key={index}>
                        <Accordion.Header>{`Q${index + 1}. ${faq.q}`}</Accordion.Header>
                        <Accordion.Body>{`A${index + 1}. ${faq.a}`}</Accordion.Body>
                    </Accordion.Item>

                ))}
            </Accordion>
            <Pagination className="mt-3 justify-content-center custom-pagination">
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Prev
                </Pagination.Prev>
                    {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item
                            key={i + 1}
                            active={i + 1 === currentPage}
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </Pagination.Item>
                    ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </Pagination.Next>
            </Pagination>
        </>
    );
};

export default FaqList;
