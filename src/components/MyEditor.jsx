import React from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function MyEditor({ value, onChange }) {
  return (
    <Editor
      apiKey="6wg12hmlrww8yissx66vxz0sjy9iflt2rdrlcw7wmjsqzr40"
      value={value}
      onEditorChange={onChange}
      init={{
        height: 400,
        menubar: false,
        plugins: ["link", "lists", "image", "code"],
        toolbar:
          "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image",
      }}
    />
  );
}
