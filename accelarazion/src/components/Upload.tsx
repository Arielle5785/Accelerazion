import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../auth/useAuth";

// const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL || "";

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>("");

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setMessage(""); // Clear previous messages
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a CSV file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(`✅ ${result.message}`);
      } else {
        setMessage(`❌ Upload failed: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      setMessage("❌ Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Upload CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload} disabled={uploading || !file} style={styles.button}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

// Inline styles for a simple UI
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "400px",
    margin: "20px auto",
    textAlign: "center",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
  },
  button: {
    marginTop: "10px",
    padding: "10px 15px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
  message: {
    marginTop: "10px",
    fontSize: "14px",
  },
};

export default Upload;
