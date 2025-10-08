import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useState } from 'react';

import '../styles/MyEditor.css'


const MyEditor = ({ initialData = "", onChange, placeholder = "" }) => {
    const [content, setContent] = useState(initialData);

    return (
        <CKEditor 
            editor={ClassicEditor}
            data={content}
            onChange={(event, editor) => {
                const data = editor.getData();
                setContent(data);
                if (onChange) onChange(data);   // 부모로 데이터 전달
                console.log("CKEditor Data:", data);
            }}
            config={{
                placeholder: placeholder,
            }}
        />
    );
};

export default MyEditor;