import React from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function MyEditor({ value, onChange, placeholder }) {
  const handleEditorChange = (content) => {
    if (!onChange) return;

    // case 1: 함수가 setState 형태일 경우
    if (typeof onChange === "function" && onChange.length <= 1) {
      onChange(content);
      return;
    }

    // case 2: input 이벤트처럼 target 객체를 기대할 경우
    onChange({ target: { name: "content", value: content } });
  };

  return (
    <Editor
      apiKey="6wg12hmlrww8yissx66vxz0sjy9iflt2rdrlcw7wmjsqzr40"
      value={value || ""} // undefined 방지
      onEditorChange={handleEditorChange}
      init={{
        height: 400,
        menubar: false,
        placeholder: placeholder || "내용을 입력하세요...",
        plugins: [
          "link",
          "lists",
          "image",
          "code",
          "table",
          "wordcount",
          "autolink",
        ],
        toolbar:
          "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | code",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
    />
  );
}
