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
            await axios.delete(`http://localhost:5000/bookings/${session._id}`);
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

    return (
        <div className="session-display">
            <div className="session-card">
                <div className="session-header">
                    <h2>Session Details</h2>
                </div>
                <div className="session-content">
                    <p><strong>Student Name:</strong> {session.studentName}</p>
                    <p><strong>Gmail:</strong> {session.gmail}</p>
                    <p><strong>Tutor Name:</strong> {session.tutorName}</p>
                    <p><strong>Module:</strong> {session.module}</p>
                    <p><strong>Date:</strong> {session.date}</p>
                    <p><strong>Start Time:</strong> {session.startTime}</p>
                    <p><strong>End Time:</strong> {session.endTime}</p>
                </div>
                <div className="session-actions">
                    <button 
                        onClick={handleUpdate}
                        className="update-button"
                    >
                        Update
                    </button>
                    <button 
                        onClick={() => setShowConfirmation(true)}
                        className="delete-button"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {showConfirmation && (
                <div className="confirmation-modal">
                    <div className="modal-content">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this session?</p>
                        <div className="modal-actions">
                            <button onClick={handleDelete} className="confirm-button">
                                Yes, Delete
                            </button>
                            <button 
                                onClick={() => setShowConfirmation(false)}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DisplaySession;