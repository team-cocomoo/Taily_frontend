import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import '../../styles/ListGroup.css';

function WalkPathList() {   
  const items = [
    { title: "강아지가 좋아해요", views: 17, date: "2025/09/22", author: "작성자" },
    { title: "뽀삐의 핫스팟", views: 17, date: "2025/09/22", author: "작성자" },
    { title: "날이 참 좋습니다..^^", views: 17, date: "2025/09/22", author: "작성자" },
    { title: "여기 오지 마셈", views: 17, date: "2025/09/22", author: "작성자" },
    { title: "산책하기 딱 좋은 날씨", views: 17, date: "2025/09/22", author: "작성자" },
    { title: "foodle의 뉨 스팟", views: 17, date: "2025/09/22", author: "작성자" },
  ];

  return (
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
                <div> 조회수 {item.views} </div>
                <div>{item.date}</div>   
            </div>
            
        </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default WalkPathList;
