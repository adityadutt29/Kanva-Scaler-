import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import Box from '@mui/material/Box';

// Dynamically import ReactQuill only on the client to avoid SSR and findDOMNode
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const QuillEditor = ({ value, onChange }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image'
  ];

  return (
    <Box className="text-editor" sx={{ width: '100%' }}>
      <ReactQuill
        theme="snow"
        style={{ height: '120px' }}
        value={value}
        onChange={(value) => onChange(value)}
        modules={modules}
        formats={formats}
      />
    </Box>
  );
};

export default QuillEditor;
