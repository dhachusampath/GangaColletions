import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import "./BulkAction.css";

function BulkAction() {
  const [excelFile, setExcelFile] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Excel file drop
  const onExcelDrop = (acceptedFiles) => {
    if (acceptedFiles[0].type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setExcelFile(acceptedFiles[0]);
      setError(null);
    } else {
      setError("Only Excel files are allowed!");
    }
  };

  // Handle image files drop
  const onImagesDrop = (acceptedFiles) => {
    const validImages = acceptedFiles.filter(file =>
      file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg"
    );
    if (validImages.length > 0) {
      setImages(validImages);
      setError(null);
    } else {
      setError("Only PNG, JPG, or JPEG images are allowed!");
    }
  };

  // Validate files before submitting
  const validateFiles = () => {
    if (!excelFile) {
      setError("Excel file is required!");
      return false;
    }
    if (images.length === 0) {
      setError("At least one image is required!");
      return false;
    }
    return true;
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFiles()) {
      return;
    }

    const formData = new FormData();
    formData.append("excelFile", excelFile);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    setLoading(true);
    try {
      const response = await axios.post("https://gangacollection-backend.onrender.com/bulk-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files");
    } finally {
      setLoading(false);
    }
  };

  // React Dropzone for Excel file
  const { getRootProps: getExcelProps, getInputProps: getExcelInputProps } = useDropzone({
    onDrop: onExcelDrop,
    accept: ".xlsx",
    multiple: false,
  });

  // React Dropzone for Images
  const { getRootProps: getImagesProps, getInputProps: getImagesInputProps } = useDropzone({
    onDrop: onImagesDrop,
    accept: "image/png, image/jpg, image/jpeg",
    multiple: true,
  });

  return (
    <div className="upload-wrapper">
      <h2 className="upload-heading">Bulk Product Upload</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="upload-section">
          <label htmlFor="excelFile" className="file-label">Excel File:</label>
          <div {...getExcelProps()} className="dropzone excel-dropzone">
            <input {...getExcelInputProps()} />
            <p className="drop-text">Drag & drop Excel file here or click to select</p>
          </div>
          {excelFile && <p className="file-name">{excelFile.name}</p>}
        </div>

        <div className="upload-section">
          <label htmlFor="images" className="file-label">Images:</label>
          <div {...getImagesProps()} className="dropzone image-dropzone">
            <input {...getImagesInputProps()} />
            <p className="drop-text">Drag & drop images here or click to select</p>
          </div>
          {images.length > 0 && (
            <div className="image-names">
              {images.map((file, index) => (
                <p key={index} className="file-name">{file.name}</p>
              ))}
            </div>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="upload-buttons">
          <button type="submit" className="upload-btn" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
          <a href="/SampleBulkUpload.xlsx" download="sample-upload.xlsx" className="download-btn">
            Download Sample Excel File
          </a>
        </div>
      </form>
    </div>
  );
}
export default BulkAction;
