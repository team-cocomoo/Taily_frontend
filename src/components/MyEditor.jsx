import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React from "react";
import "../styles/MyEditor.css";

const MyEditor = ({ value = "", onChange, placeholder = "" }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value} // 항상 부모 state 기준
      onChange={(event, editor) => {
        const data = editor.getData();
        if (onChange) onChange(data);
      }}
      config={{ placeholder }}
    />
  );
};

export default MyEditor;
