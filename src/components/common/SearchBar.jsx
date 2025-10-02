// src/components/common/SearchBar.jsx
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../../styles/SearchBar.css"; // styles 폴더의 CSS 불러오기

/**
 * 공통 검색창 컴포넌트
 *
 * props:
 * - placeholder : 입력창 안내문구 (기본값: "검색어를 입력하세요")
 * - onSearch    : 검색 버튼 클릭 시 실행할 함수
 */
function SearchBar({ placeholder = "검색어를 입력하세요", onSearch }) {
  return (
    <InputGroup className="search-bar">
      <Form.Control
        type="text"
        placeholder={placeholder}
        aria-label="search"
      />
      <Button
        variant="light"
        className="search-button"
        onClick={onSearch}
      >
        🔍
      </Button>
    </InputGroup>
  );
}

export default SearchBar;
