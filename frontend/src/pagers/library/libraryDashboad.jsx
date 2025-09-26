import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import Chatbot from "./Chatbot.jsx";
import PDFViewer from "../../components/PDFViewer.jsx";

const Library = () => {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [viewingPDF, setViewingPDF] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);

  useEffect(() => {
    fetchResources();
    fetchTags();
  }, [search, selectedTag]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const url = `http://localhost:5000/api/resources?search=${search}${
        selectedTag ? `&tag=${selectedTag}` : ""
      }`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("token") || "{}").value
          }`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setResources(data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/resources", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("token") || "{}").value
          }`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      const uniqueTags = [
        ...new Set((data || []).map((r) => r.tag).filter((tag) => tag)),
      ];
      setTags(uniqueTags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      setTags([]);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "pdf":
        return "📄";
      case "video":
        return "🎬";
      case "virtual_book":
        return "📚";
      default:
        return "📁";
    }
  };

  const getTypeClass = (type) => {
    switch (type) {
      case "pdf":
        return "type-pdf";
      case "video":
        return "type-video";
      case "virtual_book":
        return "type-book";
      default:
        return "type-default";
    }
  };

  const formatContent = (content, maxLength = 150) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const handleViewPDF = (resource) => {
    // Open PDF modal for viewing
    setViewingPDF(resource);
    setShowPDFModal(true);

    // Also trigger download (without opening new tab)
    const link = document.createElement("a");
    link.href = `http://localhost:5000${resource.fileUrl}`;
    link.download = `${resource.title}.pdf`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closePDFModal = () => {
    setShowPDFModal(false);
    setViewingPDF(null);
  };

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 py-8 px-4"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507738978512-35798112892c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZGlnaXRhbCUyMGxpYnJhcnl8ZW58MHx8MHx8fDA%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 bg-white/85 backdrop-blur-xl rounded-3xl p-10 border border-white/90 shadow-2xl">
            <h1 className="text-5xl font-bold text-slate-800 mb-4 tracking-tight">
              Digital Library
            </h1>
            <p className="text-slate-600 text-xl font-medium opacity-90">
              Discover and explore educational resources
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-10 border border-white/90">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <span className="absolute top-1/2 left-5 transform -translate-y-1/2 text-slate-500 text-lg z-10">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search resources by title..."
                  className="w-full py-5 pl-14 pr-5 border-2 border-transparent rounded-2xl text-lg bg-white/90 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="relative">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full py-5 px-5 pr-12 border-2 border-transparent rounded-2xl text-lg bg-white/90 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:bg-white text-slate-700 appearance-none cursor-pointer"
                >
                  <option value="">All Tags</option>
                  {tags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="bg-slate-700/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
            <p className="text-slate-700 text-lg font-semibold text-center">
              {resources.length} resource{resources.length !== 1 ? "s" : ""}{" "}
              found
              {selectedTag && ` in "${selectedTag}"`}
              {search && ` matching "${search}"`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
              <p className="text-slate-600 text-xl font-medium mt-4">
                Loading resources...
              </p>
            </div>
          )}

          {/* Resources Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {resources.length === 0 ? (
                <div className="col-span-full flex flex-col items-center py-20 text-center">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-12 mb-6 shadow-xl">
                    <div className="text-6xl mb-4">📖</div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">
                      No resources found
                    </h3>
                    <p className="text-slate-600 text-lg">
                      {search || selectedTag
                        ? "Try adjusting your search or filter criteria"
                        : "No resources available yet. Check back later!"}
                    </p>
                  </div>
                </div>
              ) : (
                resources.map((r) => (
                  <div
                    key={r._id}
                    className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/90 transition-all duration-500 hover:shadow-3xl hover:scale-105 hover:bg-white/95 transform-gpu"
                  >
                    <div className="p-8">
                      {/* Header */}
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">
                            {getTypeIcon(r.type)}
                          </span>
                          <span
                            className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide ${
                              r.type === "pdf"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : r.type === "video"
                                ? "bg-purple-100 text-purple-700 border border-purple-200"
                                : r.type === "virtual_book"
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {r.type}
                          </span>
                        </div>
                        <span className="text-slate-500 text-sm font-medium flex items-center">
                          {r.views} <span className="ml-1">👁️</span>
                        </span>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-slate-800 mb-4 leading-tight line-clamp-2">
                        {r.title}
                      </h3>

                      {r.description && (
                        <p className="text-slate-600 text-base leading-relaxed mb-6 line-clamp-3">
                          {r.description}
                        </p>
                      )}

                      {/* Tag */}
                      <div className="mb-6">
                        <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 font-semibold rounded-xl border border-blue-200/50 text-sm">
                          #{r.tag}
                        </span>
                      </div>

                      {/* Links */}
                      <div className="space-y-3">
                        {r.type === "pdf" && r.fileUrl && (
                          <button
                            onClick={() => handleViewPDF(r)}
                            className="flex items-center justify-center w-full py-4 px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
                          >
                            <span className="text-xl mr-3 group-hover:scale-110 transition-transform">
                              📄
                            </span>
                            <span>View PDF Document</span>
                          </button>
                        )}

                        {r.driveLink && (
                          <a
                            href={r.driveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
                          >
                            <span className="text-xl mr-3 group-hover:scale-110 transition-transform">
                              🎬
                            </span>
                            <span>Watch Video</span>
                          </a>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 pt-4 border-t border-slate-200/50 space-y-3">
                        {r.driveLink && (
                          <a
                            href={r.driveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                          >
                            Watch Video
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Footer */}
          <div className="text-center py-12 mt-16">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-lg">
              <p className="text-slate-600 text-lg font-medium">
                Made with ❤️ for learning
              </p>
            </div>
          </div>
        </div>{" "}
        {/* Closes max-w-7xl mx-auto px-6 */}
      </div>{" "}
      {/* Closes min-h-screen bg-gradient */}
      {/* PDF Modal */}
      {showPDFModal && viewingPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                {viewingPDF.title}
              </h3>
              <button
                onClick={closePDFModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <PDFViewer
                pdfUrl={`http://localhost:5000${viewingPDF.fileUrl}`}
                title={viewingPDF.title}
              />
            </div>
          </div>
        </div>
      )}
      <Chatbot />
    </>
  );
};

export default Library;
