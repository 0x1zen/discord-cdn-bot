import React, { useState } from 'react';
import axios from 'axios';

const Form = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {

      const formData = new FormData();
      formData.append('file', selectedFile);


      const response = await axios.post('http://localhost:3000/sendfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });


      console.log('File uploaded successfully:', response.data);
    } catch (error) {

      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <h2>File Upload</h2>
      <form  encType='multipart/form-data' onSubmit={handleFormSubmit} >
        <input type="file" name='file' onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default Form;
