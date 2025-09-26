
import { useEffect, useState } from "react";
import "./libraryDashboard.css";
import Navbar from "./Navbar.jsx";
import Chatbot from "./Chatbot.jsx";

const Library = () => {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchResources();
    fetchTags();
  }, [search, selectedTag]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const url = `http://localhost:5000/api/resources?search=${search}${selectedTag ? `&tag=${selectedTag}` : ''}`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '{}').value}`,
          'Content-Type': 'application/json'
        }
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
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '{}').value}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      const uniqueTags = [...new Set((data || []).map(r => r.tag).filter(tag => tag))];
      setTags(uniqueTags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      setTags([]);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'video': return '🎬';
      case 'virtual_book': return '📚';
      default: return '📁';
    }
  };

  const getTypeClass = (type) => {
    switch (type) {
      case 'pdf': return 'type-pdf';
      case 'video': return 'type-video';
      case 'virtual_book': return 'type-book';
      default: return 'type-default';
    }
  };

  const formatContent = (content, maxLength = 150) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <>
      <Navbar />
      <div className="library-container">
        <div className="library-wrapper">
        {/* Header */}
        <div className="library-header">
          <h1 className="library-title">Digital Library</h1>
          <p className="library-subtitle">Discover and explore educational resources</p>
        </div>

        {/* Search and Filter Section */}
        <div className="search-section">
          <div className="search-grid">
            <div className="search-input-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search resources by title..."
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="filter-container">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="filter-select"
              >
                <option value="">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <div className="select-arrow">▼</div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-count">
          <p>
            {resources.length} resource{resources.length !== 1 ? 's' : ''} found
            {selectedTag && ` in "${selectedTag}"`}
            {search && ` matching "${search}"`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading resources...</p>
          </div>
        )}

        {/* Resources Grid */}
        {!loading && (
          <div className="resources-grid">
            {resources.length === 0 ? (
              <div className="no-results">
                <div className="empty-state">
                  <div className="empty-icon">📖</div>
                  <h3 className="empty-title">No resources found</h3>
                  <p className="empty-text">
                    {search || selectedTag 
                      ? "Try adjusting your search or filter criteria" 
                      : "No resources available yet. Check back later!"
                    }
                  </p>
                </div>
              </div>
            ) : (
              resources.map((r) => (
                <div key={r._id} className="resource-card">
                  <div className="card-content">
                    {/* Header */}
                    <div className="card-header">
                      <div className="card-type-container">
                        <span className="card-icon">{getTypeIcon(r.type)}</span>
                        <span className={`type-badge ${getTypeClass(r.type)}`}>
                          {r.type}
                        </span>
                      </div>
                      <span className="views-count">{r.views} 👁️</span>
                    </div>

                    {/* Content */}
                    <h3 className="card-title">
                      {r.title}
                    </h3>

                    {r.description && (
                      <p className="card-description">
                        {r.description}
                      </p>
                    )}

                    {/* Tag */}
                    <div className="card-tag">
                      <span className="tag">
                        #{r.tag}
                      </span>
                    </div>

                    {/* Links */}
                    <div className="card-links">
                      {r.type === "pdf" && r.fileUrl && (
                        <a
                          href={`http://localhost:5000${r.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link pdf-link"
                        >
                          <span>📄</span>
                          <span>View PDF Document</span>
                        </a>
                      )}
                      
                      {r.driveLink && (
                        <a
                          href={r.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link video-link"
                        >
                          <span>🎬</span>
                          <span>Watch Video</span>
                        </a>
                      )}
                    </div>

                    {/* Virtual Book Content Preview */}
                    {r.type === "virtual_book" && r.content && (
                      <div className="book-preview">
                        <h4 className="preview-title">Book Preview:</h4>
                        <p className="preview-content">
                          {formatContent(r.content)}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="card-actions">
                      {(r.type === "pdf" && r.fileUrl) && (
                        <a
                          href={`http://localhost:5000${r.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn pdf-btn"
                        >
                          Open PDF
                        </a>
                      )}
                      
                      {r.driveLink && (
                        <a
                          href={r.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn video-btn"
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
        <div className="library-footer">
          <p>Made with ❤️ for learning</p>
        </div>
        </div>
      </div>
      <Chatbot />
    </>
  );
};

export default Library;