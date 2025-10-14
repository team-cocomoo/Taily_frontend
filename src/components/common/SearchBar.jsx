import { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../../styles/SearchBar.css";

/**
 * 공통 검색창 컴포넌트
 * 
 * props:
 * - placeholder : 입력창 안내문구
 * - onSearch    : 검색 버튼 클릭 또는 Enter 키 시 실행 함수
 */
function SearchBar({ placeholder = "검색어를 입력하세요", onSearch }) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(inputValue);
    }
  };

  const handleClick = () => {
    onSearch(inputValue);
  };

  return (
    <InputGroup className="search-bar">
      <Form.Control
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button variant="light" className="search-button" onClick={handleClick}>
        🔍
      </Button>
    </InputGroup>
  );
}

export default SearchBar;
