import { useState, useRef } from "react";

export const FancyImageUpload = ({ label, aspectRatio = 16 / 9, onChange, className }) => {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = null;
  };

  return (
    <div className={className}>  {/* Apply passed class here */}
      <label className="block mb-2 font-semibold text-gray-300">{label}</label>
      <div
        className={`relative w-full rounded-lg border-2 border-dashed border-gray-600 bg-gray-800 cursor-pointer hover:border-green-600 transition-colors`}
        style={{ paddingTop: `${100 / aspectRatio}%` }}
        onClick={() => inputRef.current.click()}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
              title="Remove"
            >
              &times;
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 select-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 12l-4-4m0 0l-4 4m4-4v12"
              />
            </svg>
            <span>Click or drag to upload</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};