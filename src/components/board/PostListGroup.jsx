import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import "../../styles/PostListGroup.css";

const PostListGroup = ({ items }) => {
  return (
    <div className="page-container">
      {/* 왼쪽 리스트 영역 */}
      <div className="post-list-container">
        <div className="list-wrapper">
          <ListGroup as="ul" className="list">
            {items.map((item, idx) => (
              <ListGroup.Item
                as="li"
                key={idx}
                className="list-item d-flex justify-content-between align-items-center"
              >
                <div className="title">{item.title}</div>
                <div className="d-flex align-items-center gap-2">
                  <Badge bg="light" text="dark" pill className="author">
                    {item.author}
                  </Badge>
                  <div className="d-flex flex-column text-end">
                    <div className="views">조회수 {item.views}</div>
                    <div className="date">{item.date}</div>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>

      {/* 오른쪽 영역 (비워두거나 버튼/광고 자리) */}
      <div className="right-side">
        {/* 예: 발자국 버튼 */}
      </div>
    </div>
  );
};

export default PostListGroup;
