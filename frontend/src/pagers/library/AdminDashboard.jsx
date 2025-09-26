// import { useEffect, useState } from "react";
// import API from "../api";
// import "./dashboard.css";

// const AdminDashboard = () => {
//   const [resources, setResources] = useState([]);
//   const [editingResource, setEditingResource] = useState(null);
//   const [editForm, setEditForm] = useState({
//     title: "",
//     description: "",
//     type: "",
//     tag: "",
//     driveLink: "",
//     content: ""
//   });
//   const [loading, setLoading] = useState(true);
//   const [updateLoading, setUpdateLoading] = useState(false);

//   const fetchResources = async () => {
//     try {
//       setLoading(true);
//       const res = await API.get("/resources");
//       setResources(res.data);
//     } catch (error) {
//       console.error("Error fetching resources:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchResources();
//   }, []);

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this resource?")) {
//       try {
//         await API.delete(`/resources/${id}`);
//         fetchResources();
//       } catch (error) {
//         console.error("Delete error:", error);
//         alert("Delete failed: " + (error.response?.data?.message || error.message));
//       }
//     }
//   };

//   const handleExport = () => {
//     window.open("http://localhost:5000/api/resources/export/pdf", "_blank");
//   };

//   const handleEdit = (resource) => {
//     setEditingResource(resource._id);
//     setEditForm({
//       title: resource.title,
//       description: resource.description || "",
//       type: resource.type,
//       tag: resource.tag,
//       driveLink: resource.driveLink || "",
//       content: resource.content || ""
//     });
//   };

//   const handleCancelEdit = () => {
//     setEditingResource(null);
//     setEditForm({
//       title: "",
//       description: "",
//       type: "",
//       tag: "",
//       driveLink: "",
//       content: ""
//     });
//   };

//   const handleUpdate = async (id) => {
//     if (!id) {
//       alert("Error: Resource ID is missing");
//       return;
//     }

//     // Validate required fields
//     if (!editForm.title || !editForm.type || !editForm.tag) {
//       alert("Title, type, and tag are required fields");
//       return;
//     }

//     try {
//       setUpdateLoading(true);
//       console.log("Sending update for resource:", id);
//       console.log("Update data:", editForm);

//       const response = await API.put(`/resources/${id}`, editForm);
      
//       console.log("Update response:", response.data);
      
//       if (response.data.success) {
//         setEditingResource(null);
//         setEditForm({
//           title: "",
//           description: "",
//           type: "",
//           tag: "",
//           driveLink: "",
//           content: ""
//         });
//         fetchResources(); // Refresh the list
//         alert("Resource updated successfully!");
//       }
//     } catch (error) {
//       console.error("Update error details:", error);
      
//       // More detailed error message
//       const errorMessage = error.response?.data?.message || 
//                           error.response?.data?.error || 
//                           error.message;
      
//       alert("Update failed: " + errorMessage);
      
//       // Log full error for debugging
//       if (error.response) {
//         console.error("Server response:", error.response.data);
//         console.error("Status code:", error.response.status);
//       }
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const getTypeIcon = (type) => {
//     switch (type) {
//       case 'pdf': return '📄';
//       case 'video': return '🎬';
//       case 'virtual_book': return '📚';
//       default: return '📁';
//     }
//   };

//   const getTypeClass = (type) => {
//     switch (type) {
//       case 'pdf': return 'type-pdf';
//       case 'video': return 'type-video';
//       case 'virtual_book': return 'type-book';
//       default: return 'type-default';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Loading resources...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="admin-container">
//       <div className="admin-wrapper">
//         {/* Header */}
//         <div className="admin-header">
//           <div className="header-content">
//             <div>
//               <h1 className="header-title">Admin Dashboard</h1>
//               <p className="header-subtitle">Manage your library resources</p>
//             </div>
//             <button onClick={handleExport} className="header-button">
//               📊 Export PDF Report
//             </button>
//           </div>
          
//           <div className="stats-container">
//             <div className="stats-flex">
//               <div className="stat-box">
//                 <div className="stat-number">{resources.length}</div>
//                 <div className="stat-label">Total Resources</div>
//               </div>
//               <div className="stat-box">
//                 <div className="stat-number eggplant-stat">
//                   {resources.reduce((sum, r) => sum + (r.views || 0), 0)}
//                 </div>
//                 <div className="stat-label">Total Views</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Resources Grid */}
//         <div className="resources-grid">
//           {resources.length === 0 ? (
//             <div className="empty-state">
//               <div className="empty-icon">📚</div>
//               <h3 className="empty-title">No resources yet</h3>
//               <p className="empty-text">Start by uploading some resources to your library</p>
//             </div>
//           ) : (
//             resources.map((r) => (
//               <div key={r._id} className="resource-card">
//                 {editingResource === r._id ? (
//                   // Edit Form
//                   <div className="edit-form">
//                     <h3 className="edit-title">Edit Resource</h3>
//                     <div className="form-grid">
//                       <div className="form-group">
//                         <label className="form-label">Title *</label>
//                         <input
//                           type="text"
//                           name="title"
//                           value={editForm.title}
//                           onChange={handleInputChange}
//                           className="form-input"
//                           placeholder="Enter title"
//                           required
//                         />
//                       </div>
                      
//                       <div className="form-group">
//                         <label className="form-label">Description</label>
//                         <textarea
//                           name="description"
//                           value={editForm.description}
//                           onChange={handleInputChange}
//                           className="form-input form-textarea"
//                           placeholder="Enter description"
//                           rows="2"
//                         />
//                       </div>

//                       <div className="form-grid-cols">
//                         <div className="form-group">
//                           <label className="form-label">Type *</label>
//                           <select
//                             name="type"
//                             value={editForm.type}
//                             onChange={handleInputChange}
//                             className="form-input"
//                             required
//                           >
//                             <option value="">Select Type</option>
//                             <option value="pdf">PDF Document</option>
//                             <option value="video">Video</option>
//                             <option value="virtual_book">Virtual Book</option>
//                           </select>
//                         </div>
                        
//                         <div className="form-group">
//                           <label className="form-label">Tag *</label>
//                           <input
//                             type="text"
//                             name="tag"
//                             value={editForm.tag}
//                             onChange={handleInputChange}
//                             className="form-input"
//                             placeholder="Enter tag"
//                             required
//                           />
//                         </div>
//                       </div>

//                       {editForm.type === "video" && (
//                         <div className="form-group">
//                           <label className="form-label">Drive Link</label>
//                           <input
//                             type="url"
//                             name="driveLink"
//                             value={editForm.driveLink}
//                             onChange={handleInputChange}
//                             className="form-input"
//                             placeholder="Enter Google Drive link"
//                           />
//                         </div>
//                       )}

//                       {editForm.type === "virtual_book" && (
//                         <div className="form-group">
//                           <label className="form-label">Content</label>
//                           <textarea
//                             name="content"
//                             value={editForm.content}
//                             onChange={handleInputChange}
//                             className="form-input form-textarea"
//                             placeholder="Enter book content"
//                             rows="4"
//                           />
//                         </div>
//                       )}

//                       <div className="form-actions">
//                         <button 
//                           onClick={() => handleUpdate(r._id)}
//                           className="btn btn-success"
//                           disabled={updateLoading}
//                         >
//                           {updateLoading ? "⏳ Updating..." : "💾 Save Changes"}
//                         </button>
//                         <button 
//                           onClick={handleCancelEdit}
//                           className="btn btn-secondary"
//                           disabled={updateLoading}
//                         >
//                           ❌ Cancel
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   // Display Mode
//                   <div className="card-content">
//                     <div className="card-header">
//                       <div className="card-title-section">
//                         <span className="card-icon">{getTypeIcon(r.type)}</span>
//                         <h3 className="card-title">{r.title}</h3>
//                       </div>
//                       <span className={`type-badge ${getTypeClass(r.type)}`}>
//                         {r.type}
//                       </span>
//                     </div>

//                     {r.description && (
//                       <p className="card-description">{r.description}</p>
//                     )}

//                     <div className="card-details">
//                       <div className="detail-item">
//                         <span>🏷️</span>
//                         <span className="tag">{r.tag}</span>
//                       </div>
//                       <div className="detail-item">
//                         <span>👁️</span>
//                         <span className="views">{r.views} views</span>
//                       </div>
//                     </div>

//                     {(r.driveLink || r.fileUrl) && (
//                       <div className="links-section">
//                         <div className="links-title">Links:</div>
//                         <div className="space-y-1">
//                           {r.driveLink && (
//                             <a href={r.driveLink} target="_blank" rel="noopener noreferrer" className="link">
//                               🔗 Google Drive Link
//                             </a>
//                           )}
//                           {r.fileUrl && (
//                             <a href={`http://localhost:5000${r.fileUrl}`} target="_blank" rel="noopener noreferrer" className="link">
//                               📄 View PDF File
//                             </a>
//                           )}
//                         </div>
//                       </div>
//                     )}

//                     <div className="card-actions">
//                       <button 
//                         onClick={() => handleEdit(r)}
//                         className="btn btn-primary"
//                       >
//                         <span>✏️</span>
//                         <span>Edit</span>
//                       </button>
//                       <button 
//                         onClick={() => handleDelete(r._id)}
//                         className="btn btn-danger"
//                       >
//                         <span>🗑️</span>
//                         <span>Delete</span>
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

//------------------------------------------------------------------

import { useEffect, useState } from "react";
import "./dashboard.css";
import Navbar from "./Navbar.jsx";

const AdminDashboard = () => {
  const [resources, setResources] = useState([]);
  const [editingResource, setEditingResource] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    type: "",
    tag: "",
    driveLink: "",
    content: ""
  });
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchResources = async () => {
    try {
      setLoading(true);
      console.log("📥 Fetching resources...");
      const res = await fetch("http://localhost:5000/api/resources", {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '{}').value}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      console.log("✅ Resources fetched:", (data || []).length);
      setResources(data || []);
    } catch (error) {
      console.error("❌ Error fetching resources:", error);
      alert("Failed to load resources: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await fetch(`http://localhost:5000/api/resources/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '{}').value}`,
            'Content-Type': 'application/json'
          }
        });
        fetchResources();
      } catch (error) {
        console.error("Delete error:", error);
        alert("Delete failed: " + error.message);
      }
    }
  };

  const handleExport = () => {
    window.open("http://localhost:5000/api/resources/export/pdf", "_blank");
  };

  const handleEdit = (resource) => {
    console.log("✏️ Editing resource:", resource._id);
    setEditingResource(resource._id);
    setEditForm({
      title: resource.title,
      description: resource.description || "",
      type: resource.type,
      tag: resource.tag,
      driveLink: resource.driveLink || "",
      content: resource.content || ""
    });
  };

  const handleCancelEdit = () => {
    console.log("❌ Cancel edit");
    setEditingResource(null);
  };

  const handleUpdate = async (id) => {
    if (!id) {
      alert("Error: Resource ID is missing");
      return;
    }

    // Validate required fields
    if (!editForm.title?.trim()) {
      alert("Title is required");
      return;
    }
    if (!editForm.type) {
      alert("Type is required");
      return;
    }
    if (!editForm.tag?.trim()) {
      alert("Tag is required");
      return;
    }

    try {
      setUpdateLoading(true);
      console.log("🔄 Starting update for resource:", id);
      console.log("Update data:", editForm);

      // Create a clean data object
      const updateData = {
        title: editForm.title.trim(),
        description: editForm.description?.trim() || "",
        type: editForm.type,
        tag: editForm.tag.trim(),
        driveLink: editForm.driveLink?.trim() || "",
        content: editForm.content?.trim() || ""
      };

      console.log("Sending update data:", updateData);

      const response = await fetch(`http://localhost:5000/api/resources/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '{}').value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      const data = await response.json();
      console.log("✅ Update successful:", data);
      
      setEditingResource(null);
      setEditForm({
        title: "",
        description: "",
        type: "",
        tag: "",
        driveLink: "",
        content: ""
      });
      
      // Refresh the list
      await fetchResources();
      
      alert("Resource updated successfully!");
    } catch (error) {
      console.error("❌ Update error details:", error);
      
      let errorMessage = "Update failed: ";
      
      if (error.response) {
        errorMessage += `Server responded with ${error.response.status}: `;
        if (error.response.data?.message) {
          errorMessage += error.response.data.message;
        } else if (error.response.data?.error) {
          errorMessage += error.response.data.error;
        } else {
          errorMessage += JSON.stringify(error.response.data);
        }
      } else if (error.request) {
        errorMessage += "No response from server. Check if backend is running on localhost:5000";
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Test function to check API connectivity
  const testConnection = async () => {
    try {
      // console.log("🧪 Testing API connection...");
      const response = await fetch("http://localhost:5000/api/resources", {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token') || '{}').value}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log("✅ API connection test successful");
      alert(`API connection successful! Found ${(data || []).length} resources.`);
    } catch (error) {
      console.error("❌ API connection test failed:", error);
      alert("API connection failed: " + error.message);
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

  const getTypeClass = (type) => {
    switch (type) {
      case 'pdf': return 'type-pdf';
      case 'video': return 'type-video';
      // case 'virtual_book': return 'type-book';
      default: return 'type-default';
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading resources...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-container">\n        <div className="admin-wrapper">
        {/* Header */}
        <div className="admin-header">
          <div className="header-content">
            <div>
              <h1 className="header-title">Admin Dashboard</h1>
              <p className="header-subtitle">Manage your library resources</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={handleExport} className="header-button">
                📊 Export PDF
              </button>
              <button onClick={testConnection} className="header-button" style={{ background: '#10b981' }}>
                🧪 Test Connection
              </button>
            </div>
          </div>
          
          <div className="stats-container">
            <div className="stats-flex">
              <div className="stat-box">
                <div className="stat-number">{resources.length}</div>
                <div className="stat-label">Total Resources</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">
                  {resources.reduce((sum, r) => sum + (r.views || 0), 0)}
                </div>
                <div className="stat-label">Total Views</div>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="resources-grid">
          {resources.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3 className="empty-title">No resources yet</h3>
              <p className="empty-text">Start by uploading some resources to your library</p>
            </div>
          ) : (
            resources.map((r) => (
              <div key={r._id} className="resource-card">
                {editingResource === r._id ? (
                  // Edit Form
                  <div className="edit-form">
                    <h3 className="edit-title">Edit Resource</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input
                          type="text"
                          name="title"
                          value={editForm.title}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter title"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleInputChange}
                          className="form-input form-textarea"
                          placeholder="Enter description"
                          rows="2"
                        />
                      </div>

                      <div className="form-grid-cols">
                        <div className="form-group">
                          <label className="form-label">Type *</label>
                          <select
                            name="type"
                            value={editForm.type}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                          >
                            <option value="">Select Type</option>
                            <option value="pdf">PDF Document</option>
                            <option value="video">Video</option>
                            {/* <option value="virtual_book">Virtual Book</option> */}
                          </select>
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Tag *</label>
                          <input
                            type="text"
                            name="tag"
                            value={editForm.tag}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Enter tag"
                            required
                          />
                        </div>
                      </div>

                      {editForm.type === "video" && (
                        <div className="form-group">
                          <label className="form-label">Drive Link</label>
                          <input
                            type="url"
                            name="driveLink"
                            value={editForm.driveLink}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Enter Google Drive link"
                          />
                        </div>
                      )}

                      {/* {editForm.type === "virtual_book" && (
                        <div className="form-group">
                          <label className="form-label">Content</label>
                          <textarea
                            name="content"
                            value={editForm.content}
                            onChange={handleInputChange}
                            className="form-input form-textarea"
                            placeholder="Enter book content"
                            rows="4"
                          />
                        </div>
                      )} */}

                      <div className="form-actions">
                        <button 
                          onClick={() => handleUpdate(r._id)}
                          className="btn btn-success"
                          disabled={updateLoading}
                        >
                          {updateLoading ? "⏳ Updating..." : "💾 Save Changes"}
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="btn btn-secondary"
                          disabled={updateLoading}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="card-content">
                    <div className="card-header">
                      <div className="card-title-section">
                        <span className="card-icon">{getTypeIcon(r.type)}</span>
                        <h3 className="card-title">{r.title}</h3>
                      </div>
                      <span className={`type-badge ${getTypeClass(r.type)}`}>
                        {r.type}
                      </span>
                    </div>

                    {r.description && (
                      <p className="card-description">{r.description}</p>
                    )}

                    <div className="card-details">
                      <div className="detail-item">
                        <span>🏷️</span>
                        <span className="tag">{r.tag}</span>
                      </div>
                      <div className="detail-item">
                        <span>👁️</span>
                        <span className="views">{r.views} views</span>
                      </div>
                    </div>

                    {(r.driveLink || r.fileUrl) && (
                      <div className="links-section">
                        <div className="links-title">Links:</div>
                        <div className="space-y-1">
                          {r.driveLink && (
                            <a href={r.driveLink} target="_blank" rel="noopener noreferrer" className="link">
                              🔗 Google Drive Link
                            </a>
                          )}
                          {r.fileUrl && (
                            <a href={`http://localhost:5000${r.fileUrl}`} target="_blank" rel="noopener noreferrer" className="link">
                              📄 View PDF File
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="card-actions">
                      <button 
                        onClick={() => handleEdit(r)}
                        className="btn btn-primary"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(r._id)}
                        className="btn btn-danger"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default AdminDashboard;