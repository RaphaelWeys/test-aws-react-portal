import React, { useMemo } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const RichEditorExample = ({ setValue, value }) => {
  const formatValue = useMemo(() => {
    if (value.startsWith('[html]!')) return value.substring(7);
    if (value.startsWith('[html]')) return value.substring(6);
  }, [value]);

  const handleEditorChange = (content) => {
    setValue(`[html]${content}`);
  };

  return (
    <Editor
      apiKey="jy0ddbjrt8gnyip1mzo7x8r150zkqug94xv5zf0auljtgvxb"
      value={formatValue}
      init={{
        height: 300,
        menubar: true,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor |alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default RichEditorExample;
