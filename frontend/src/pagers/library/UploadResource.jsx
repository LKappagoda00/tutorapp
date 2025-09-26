
import { useState } from "react";
import Navbar from "./Navbar.jsx";
import Chatbot from "./Chatbot.jsx";
import Sidebar from "../../components/Sidebar.jsx";

const UploadResource = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "pdf",
    tag: "",
    driveLink: "",
    content: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.tag.trim()) newErrors.tag = "Tag is required";
    
    if (form.type === "pdf" && !file) {
      newErrors.file = "PDF file is required";
    }
    
    if (form.type === "video" && !form.driveLink.trim()) {
      newErrors.driveLink = "Drive link is required";
    }
    
    if (form.type === "virtual_book" && !form.content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const data = new FormData();
      
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("type", form.type);
      data.append("tag", form.tag);

      if (form.type === "pdf" && file) {
        data.append("file", file);  // Changed from "pdf" to "file" to match backend
      }
      
      if (form.type === "video" && form.driveLink) {
        data.append("driveLink", form.driveLink);
      }
      
      if (form.type === "virtual_book" && form.content) {
        data.append("content", form.content);
      }

      const response = await fetch("http://localhost:5000/api/resources", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '{}').value}`
        },
        body: data
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }
      
      // Success state
      setIsSubmitted(false);
      setForm({
        title: "",
        description: "",
        type: "pdf",
        tag: "",
        driveLink: "",
        content: "",
      });
      setFile(null);
      setErrors({});
      
      alert(`🎉 Resource "${responseData.resource.title}" uploaded successfully!`);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(`❌ Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Check file type
      if (selectedFile.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, file: 'Please select a PDF file only' }));
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: 'File size must be less than 10MB' }));
        e.target.value = ''; // Clear the input
        return;
      }
      
      setFile(selectedFile);
    } else {
      setFile(null);
    }
    
    if (errors.file) {
      setErrors(prev => ({
        ...prev,
        file: ""
      }));
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'video': return '🎬';
      // case 'virtual_book': return '📚';
      default: return '📁';
    }
  };

  return (
    <>
    
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">📤 Upload Resource</h1>
          <p className="text-gray-600 text-lg">Share educational content with the community</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-royalBlue focus:border-transparent transition-all duration-200 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter resource title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royalBlue focus:border-transparent transition-all duration-200"
                placeholder="Describe your resource..."
              />
            </div>

            {/* Type and Tag */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Type *
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royalBlue focus:border-transparent appearance-none bg-white"
                  >
                    <option value="pdf">📄 PDF Document</option>
                    <option value="video">🎬 Video</option>
                    {/* <option value="virtual_book">📚 Virtual Book</option> */}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <span className="text-gray-400">▼</span>
                  </div>
                </div>
              </div>

              {/* Tag */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag/Category *
                </label>
                <input
                  type="text"
                  name="tag"
                  value={form.tag}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-royalBlue focus:border-transparent ${
                    errors.tag ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., math, science, history"
                />
                {errors.tag && (
                  <p className="text-red-500 text-sm mt-1">{errors.tag}</p>
                )}
              </div>
            </div>

            {/* Dynamic Fields based on Type */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">{getTypeIcon(form.type)}</span>
                <span className="font-medium text-gray-700">
                  {form.type === 'pdf' && 'PDF Upload'}
                  {form.type === 'video' && 'Video Details'}
                  {/* {form.type === 'virtual_book' && 'Book Content'} */}
                </span>
              </div>

              {form.type === "pdf" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload PDF File *
                  </label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                    errors.file ? 'border-red-500 bg-red-50' : 
                    file ? 'border-green-500 bg-green-50' : 
                    'border-gray-300 hover:border-royalBlue'
                  }`}>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="text-3xl mb-2">
                        {file ? '✅' : '📄'}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {file ? (
                          <span className="text-green-600 font-medium">
                            ✓ {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}MB)
                          </span>
                        ) : (
                          "Click to upload PDF or drag and drop"
                        )}
                      </p>
                      <p className="text-xs text-gray-500">Maximum file size: 10MB • PDF format only</p>
                    </label>
                  </div>
                  {errors.file && (
                    <p className="text-red-500 text-sm mt-2">{errors.file}</p>
                  )}
                </div>
              )}

              {form.type === "video" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Drive Link *
                  </label>
                  <input
                    type="url"
                    name="driveLink"
                    value={form.driveLink}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-royalBlue focus:border-transparent ${
                      errors.driveLink ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://drive.google.com/..."
                  />
                  {errors.driveLink && (
                    <p className="text-red-500 text-sm mt-1">{errors.driveLink}</p>
                  )}
                </div>
              )}

              {/* {form.type === "virtual_book" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Content *
                  </label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleInputChange}
                    rows="6"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-royalBlue focus:border-transparent ${
                      errors.content ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter the content of your virtual book..."
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                  )}
                </div>
              )} */}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-royalBlue to-eggplant text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading...
                </div>
              ) : (
                <>🚀 Upload Resource</>
              )}
            </button>

            {/* Form Tips */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 Tips:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use descriptive titles and tags</li>
                <li>• PDF files should be under 10MB</li>
                <li>• Ensure drive links are publicly accessible</li>
                <li>• Virtual books support rich text content</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
      </div>
      <Chatbot />
    </>
  );
};

export default UploadResource;
