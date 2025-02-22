import React, { useState, useRef } from "react";

interface UploadPhotoProps {
  onFileSelect: (file: File) => void;
}

export const UploadPhoto: React.FC<UploadPhotoProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileSelect(file);
      e.dataTransfer.clearData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <p className="block text-base">Photo</p>

      <div
        className={`border-1 p-4 rounded-md text-center bg-white ${
          dragActive ? "border-blue-500" : "border-[#CBB6E5]"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleChange}
          ref={inputRef}
        />

        {selectedFile ? (
          <div className="flex justify-between items-center">
            <span>{selectedFile.name}</span>
            <button
              type="button"
              onClick={handleDelete}
              className=" text-[#000853] hover:text-red-500 transition-colors"
            >
              <svg
                width="60"
                height="30"
                viewBox="25 15 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 22C37.523 22 42 26.477 42 32C42 37.523 37.523 42 32 42C26.477 42 22 37.523 22 32C22 26.477 26.477 22 32 22ZM29.879 28.464C29.6995 28.2827 29.4574 28.177 29.2025 28.1683C28.9475 28.1597 28.6988 28.2488 28.5074 28.4175C28.316 28.5861 28.1963 28.8216 28.1728 29.0756C28.1493 29.3297 28.2238 29.5831 28.381 29.784L28.465 29.879L30.585 31.999L28.465 34.121C28.2837 34.3005 28.178 34.5426 28.1693 34.7975C28.1607 35.0525 28.2498 35.3012 28.4185 35.4926C28.5871 35.684 28.8226 35.8037 29.0766 35.8272C29.3307 35.8507 29.5841 35.7762 29.785 35.619L29.879 35.536L32 33.414L34.121 35.536C34.3005 35.7173 34.5426 35.823 34.7975 35.8317C35.0525 35.8403 35.3012 35.7512 35.4926 35.5825C35.684 35.4139 35.8037 35.1784 35.8272 34.9244C35.8507 34.6703 35.7762 34.4169 35.619 34.216L35.536 34.121L33.414 32L35.536 29.879C35.7173 29.6995 35.823 29.4574 35.8317 29.2025C35.8403 28.9475 35.7512 28.6988 35.5825 28.5074C35.4139 28.316 35.1784 28.1963 34.9244 28.1728C34.6703 28.1493 34.4169 28.2238 34.216 28.381L34.121 28.464L32 30.586L29.879 28.464Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div>
            <label
              htmlFor="file-upload"
              className="cursor-pointer"
              style={{
                color: "#761BE4",
                fontWeight: 400,
                fontSize: "16px",
                textDecoration: "underline",
                textDecorationStyle: "solid",
              }}
            >
              Upload a file
            </label>
            <span className="hidden md:inline"> or drag and drop here</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPhoto;
