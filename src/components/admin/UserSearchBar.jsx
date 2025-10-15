import React, { useState, useEffect } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";
import "../../styles/admin/Admin.css"; 

const UserSearchBar = ({ value = "", onSearch }) => {
    const [keyword, setKeyword] = useState(value);

    // 부모에서 전달되는 value가 바뀌면 내부 상태 업데이트
    useEffect(() => {
        setKeyword(value);
    }, [value]);

    const handleSearchClick = () => {
        console.log("검색어:", keyword); // 추가
        onSearch(keyword);
    };

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            onSearch(keyword);
        }
    };

    return (
        <InputGroup
            className="search-bar"
            style={{
                borderRadius: "25px",
                overflow: "hidden",
                maxWidth: "400px",
                margin: "0 auto 20px",
            }}
        >
            <Form.Control
                type="text"
                placeholder="회원 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleEnter}
                style={{ borderRadius: "25px 0 0 25px", borderRight: "0" }}
            />
            <Button
                variant="light"
                onClick={handleSearchClick}
                style={{ borderRadius: "0 25px 25px 0", padding: "0 12px" }}
            >
                🔍
            </Button>
        </InputGroup>
    );
};

export default UserSearchBar;
