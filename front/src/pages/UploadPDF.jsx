import React, { useState } from "react";
import axios from "axios";


const UploadPDF = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://127.0.0.1:5000/upload_pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setExtractedText(res.data.extracted_text);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file");
    }
  };

  return (
    <div className="upload-pdf">
      <h1>Upload PDF to Create Test</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {extractedText && (
        <div>
          <h3>Extracted Questions:</h3>
          <pre>{extractedText}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadPDF;
