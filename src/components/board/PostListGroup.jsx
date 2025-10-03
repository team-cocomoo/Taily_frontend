import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import "../../styles/PostListGroup.css";

const PostListGroup = ({ items, onItemClick }) => {
  return (
    <div className="page-container">
      <div className="post-list-container">
        <div className="list-wrapper">
          <ListGroup as="ul" className="list">
            {items.map((item) => (
              <ListGroup.Item
                as="li"
                key={item.id}
                className="list-item d-flex justify-content-between align-items-center"
                onClick={() => onItemClick(item.id)} 
                style={{ cursor: "pointer" }}
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
      <div className="right-side"></div>
    </div>
  );
};

export default PostListGroup;
