
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SessionDisplay.css'; // Import the CSS file

function DisplaySession({ session, onDelete }) {
    const history = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleDelete = async () => {
        setShowConfirmation(false);
        try {
            await axios.delete(`http://localhost:5000/api/bookings/${session._id}`);
            alert('Session deleted successfully!');
            if (onDelete) {
                onDelete(session._id); // Refresh the parent component
            }
            history('/sessions'); // Redirect to sessions list
        } catch (error) {
            console.error('Error deleting session:', error);
            alert('Error deleting session. Please try again.');
        }
    };

    const handleUpdate = () => {
        history(`/update-session/${session._id}`); // Navigate to update page
    };

    const openConfirmation = () => {
        setShowConfirmation(true);
    };

    const closeConfirmation = () => {
        setShowConfirmation(false);
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <>
            <div className="session-card">
                <div className="session-header">
                    <h2>Session Details</h2>
                    <div className="session-date-badge">
                        {formatDate(session.date)}
                    </div>
                </div>
                
                <div className="session-details">
                    <div className="session-detail-item">
                        <span className="detail-label">👤 Student Name</span>
                        <span className="detail-value">{session.studentName}</span>
                    </div>
                    
                    <div className="session-detail-item">
                        <span className="detail-label">✉️ Email</span>
                        <span className="detail-value">{session.gmail}</span>
                    </div>
                    
                    <div className="session-detail-item">
                        <span className="detail-label">🎓 Tutor Name</span>
                        <span className="detail-value">{session.tutorName}</span>
                    </div>
                    
                    <div className="session-detail-item">
                        <span className="detail-label">📚 Module</span>
                        <span className="detail-value">{session.module}</span>
                    </div>
                </div>
                
                <div className="session-time">
                    <div className="time-slot">
                        <span className="time-label">Start Time</span>
                        <span className="time-value">{session.startTime}</span>
                    </div>
                    
                    <div className="time-divider"></div>
                    
                    <div className="time-slot">
                        <span className="time-label">End Time</span>
                        <span className="time-value">{session.endTime}</span>
                    </div>
                </div>
                
                <div className="session-actions">
                    <button 
                        onClick={handleUpdate}
                        className="action-button update-button"
                    >
                        <span>✏️</span> Update
                    </button>
                    
                    <button 
                        onClick={openConfirmation}
                        className="action-button delete-button"
                    >
                        <span>🗑️</span> Delete
                    </button>
                </div>
            </div>

            {showConfirmation && (
                <div className="confirmation-dialog">
                    <div className="dialog-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this session? This action cannot be undone.</p>
                        <div className="dialog-buttons">
                            <button 
                                onClick={handleDelete}
                                className="dialog-button dialog-confirm"
                            >
                                Yes, Delete
                            </button>
                            <button 
                                onClick={closeConfirmation}
                                className="dialog-button dialog-cancel"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DisplaySession;