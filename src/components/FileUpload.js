import React, { useState, useEffect } from "react";
import axios from "axios";

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [shortUrl, setShortUrl] = useState("");
  const [allImages, setAllImages] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result); // Set base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        { image: selectedFile }, // Send base64 string in JSON payload
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setShortUrl(response.data.shortUrl);
      fetchAllImages(); // Fetch all images after upload
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Fetch all images from the server
  const fetchAllImages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/images");
      setAllImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchAllImages(); // Fetch all images when the component mounts
  }, []);

  return (
    <div>
      <h1>Upload Image and Get Short URL</h1>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button onClick={handleUpload}>Upload</button>

      {shortUrl && (
        <div>
          <p>Short URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}

      {shortUrl && (
        <div>
          <p>Uploaded Image:</p>
          <img
            src={shortUrl}
            alt="Uploaded"
            style={{
              maxWidth: "200px",
              height: "auto",
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "5px",
            }}
          />
        </div>
      )}

      {/* Display all uploaded images */}
      <div>
        <h2>All Uploaded Images</h2>
        {allImages.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {allImages.map((image) => (
              <div key={image.imageId} style={{ margin: "10px" }}>
                <a href={image.shortUrl} target="_blank" rel="noopener noreferrer">
                <img
            src={image.shortUrl}
            // src={image.shortUrl}
            // alt={`Image ${image.imageId}`}
            alt="Uploaded"
            style={{
              maxWidth: "200px",
              height: "auto",
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "5px",
            }}
          />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p>No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
