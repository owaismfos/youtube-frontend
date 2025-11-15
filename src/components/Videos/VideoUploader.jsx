import React, { useState, useRef } from 'react';
import { Upload, Video, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const VideoUploader = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, uploading, processing, completed, error
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState('');
  const [qualities, setQualities] = useState([]);
  const fileInputRef = useRef(null);
  const wsRef = useRef(null);

  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
  const API_BASE = 'http://localhost:8000/api/v1/videos';

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      setError('');
      setStatus('idle');
      setUploadProgress(0);
      setProcessingProgress(0);
    } else {
      setError('Please select a valid video file');
    }
  };

  const uploadChunked = async () => {
    if (!file) return;

    setStatus('uploading');
    setError('');

    try {
      // 1. Initialize upload
      const initResponse = await fetch(`${API_BASE}/upload/init/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          filesize: file.size,
          content_type: file.type
        })
      });

      const { upload_id, video_id } = await initResponse.json();
      setVideoId(video_id);

      // 2. Upload chunks
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('chunk_index', i);
        formData.append('total_chunks', totalChunks);
        formData.append('upload_id', upload_id);

        await fetch(`${API_BASE}/upload/chunk/`, {
          method: 'POST',
          body: formData
        });

        setUploadProgress(Math.round(((i + 1) / totalChunks) * 100));
      }

      // 3. Complete upload
      await fetch(`${API_BASE}/upload/complete/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upload_id, video_id })
      });

      // 4. Connect WebSocket for processing updates
      connectWebSocket(video_id);
      setStatus('processing');

    } catch (err) {
      setError('Upload failed: ' + err.message);
      setStatus('error');
    }
  };

  const connectWebSocket = (vId) => {
    // WebSocket connection for real-time processing updates
    const ws = new WebSocket(`ws://localhost:8000/ws/videos/${vId}/`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'processing_progress') {
        setProcessingProgress(data.progress);
      } else if (data.type === 'processing_complete') {
        setStatus('completed');
        setQualities(data.qualities);
        ws.close();
      } else if (data.type === 'error') {
        setError(data.message);
        setStatus('error');
        ws.close();
      }
    };

    ws.onerror = () => {
      setError('WebSocket connection failed');
      setStatus('error');
    };
  };

  const resetUpload = () => {
    setFile(null);
    setStatus('idle');
    setUploadProgress(0);
    setProcessingProgress(0);
    setVideoId(null);
    setError('');
    setQualities([]);
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'uploading': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader className="w-5 h-5 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Video className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Video className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Video Uploader</h1>
          </div>

          {/* Upload Area */}
          {status === 'idle' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">
                  {file ? file.name : 'Click to select a video file'}
                </p>
                <p className="text-sm text-gray-500">
                  Supports MP4, MOV, AVI, WebM
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {file && (
                <button
                  onClick={uploadChunked}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Start Upload
                </button>
              )}
            </div>
          )}

          {/* Progress Display */}
          {(status === 'uploading' || status === 'processing') && (
            <div className="space-y-6">
              {/* Upload Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">
                    Upload Progress
                  </span>
                  <span className="text-sm font-medium text-gray-400">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>

              {/* Processing Progress */}
              {status === 'processing' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">
                      Processing Progress
                    </span>
                    <span className="text-sm font-medium text-gray-400">
                      {processingProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-yellow-500 h-full transition-all duration-300"
                      style={{ width: `${processingProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Generating multiple quality versions...
                  </p>
                </div>
              )}

              {/* Status Badge */}
              <div className="flex items-center gap-2 text-white">
                <div className={`p-2 rounded-full ${getStatusColor()}`}>
                  {getStatusIcon()}
                </div>
                <span className="font-medium capitalize">{status}</span>
              </div>
            </div>
          )}

          {/* Completed State */}
          {status === 'completed' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-green-400 bg-green-900/20 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Upload Complete!</p>
                  <p className="text-sm text-gray-400">
                    Video ID: {videoId}
                  </p>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">
                  Available Qualities
                </h3>
                <div className="space-y-2">
                  {qualities.length > 0 ? (
                    qualities.map((quality, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-gray-600 p-3 rounded"
                      >
                        <span className="text-gray-200">{quality.resolution}</span>
                        <span className="text-sm text-gray-400">
                          {quality.bitrate}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-2">
                      {['1080p', '720p', '480p', '360p'].map((q) => (
                        <div
                          key={q}
                          className="flex justify-between items-center bg-gray-600 p-3 rounded"
                        >
                          <span className="text-gray-200">{q}</span>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={resetUpload}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Upload Another Video
              </button>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center gap-3 text-red-400 bg-red-900/20 p-4 rounded-lg">
              <AlertCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">How it works</h2>
          <ol className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="font-bold text-blue-400">1.</span>
              <span>Select your video file (any format supported)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-400">2.</span>
              <span>Video is uploaded in 5MB chunks for reliability</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-400">3.</span>
              <span>Server processes video into multiple quality versions</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-400">4.</span>
              <span>Real-time progress updates via WebSocket</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default VideoUploader;