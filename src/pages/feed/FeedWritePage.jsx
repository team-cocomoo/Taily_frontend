// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ImageBox from "../../components/board/ImageBox";
// import FeedContent from "../../components/feed/FeedContent.jsx";
// import { createFeed } from "@/api/feedService";

// const FeedWritePage = () => {
//   const navigate = useNavigate();
//   const [values, setValues] = useState({
//     content: "",
//     images: [],
//     tags: [],
//   });

//   // content 변경
//   const handleContentChange = (val) =>
//     setValues((prev) => ({ ...prev, content: val }));

//   // 이미지 변경
//   const handleImagesChange = (files) =>
//     setValues((prev) => ({ ...prev, images: files }));

//   // 태그 입력
//   const handleTagsChange = (e) => {
//     const tagArray = e.target.value
//       .split(",")
//       .map((tag) => tag.trim())
//       .filter(Boolean);
//     setValues((prev) => ({ ...prev, tags: tagArray }));
//   };

//   const handleUpload = async () => {
//     if (!values.content.trim()) return alert("내용을 입력해주세요.");

//     try {
//       const formData = new FormData();

//       const feedData = {
//         content: values.content,
//         tableTypeId: 3,
//         tags: values.tags,
//       };

//       formData.append(
//         "feed",
//         new Blob([JSON.stringify(feedData)], { type: "application/json" })
//       );

//       values.images.forEach((file) => formData.append("images", file));

//       await createFeed(formData);
//       alert("피드 업로드 완료!");
//       navigate("/feeds");
//     } catch (err) {
//       console.error("업로드 실패:", err);
//       alert("업로드 실패");
//     }
//   };

//   return (
//     <div className="container main-content">
//       <div className="feed-card border p-3 mb-3 rounded shadow-sm">
//         <h4 className="mb-3">피드 업로드</h4>

//         {/* 내용 입력 */}
//         <FeedContent
//           content={values.content}
//           setContent={handleContentChange}
//         />

//         {/* 이미지 업로드 */}
//         <ImageBox images={values.images} setImages={handleImagesChange} />

//         {/* 태그 입력 */}
//         <input
//           type="text"
//           placeholder="태그를 ,로 구분하여 입력하세요"
//           value={values.tags.join(",")}
//           onChange={handleTagsChange}
//           className="form-control mb-3"
//         />

//         <div className="d-flex justify-content-end gap-2">
//           <button
//             className="btn btn-secondary"
//             onClick={() => navigate("/feeds")}
//           >
//             목록
//           </button>
//           <button className="btn btn-primary" onClick={handleUpload}>
//             업로드
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeedWritePage;
