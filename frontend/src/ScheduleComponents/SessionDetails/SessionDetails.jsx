import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisplaySession from '../SessionDisplay/SessionDisplay';
import './SessionDetails.css'; // Import the CSS file

const URL = "http://localhost:5000/api/bookings";

const fetchHandler = async () => {
    try {
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

function SessionDetails() {
    const [sessions, setSessions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        console.log("useEffect running - fetching data...");
        fetchHandler().then((data) => {
            console.log("Data received:", data);
            console.log("Number of sessions:", data.length);
            setSessions(data);
        }).catch(error => {
            console.error("Fetch error:", error);
        });
    }, []);

    const handlePrint = () => {
        if (sessions.length === 0) {
            alert("No sessions to print!");
            return;
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Session Report</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            padding: 30px; 
                            line-height: 1.6;
                        }
                        .session { 
                            border: 1px solid #ccc; 
                            margin: 15px 0; 
                            padding: 20px; 
                            border-radius: 8px;
                            page-break-inside: avoid;
                        }
                        h1 { 
                            text-align: center; 
                            color: #333;
                            margin-bottom: 30px;
                        }
                        h3 {
                            color: #007bff;
                            margin-top: 0;
                        }
                        p {
                            margin: 8px 0;
                        }
                        strong {
                            color: #555;
                        }
                        @media print {
                            body { padding: 15px; }
                            .session { border: 1px solid #000; }
                        }
                    </style>
                </head>
                <body>
                    <h1>Session Booking Report</h1>
                    ${sessions.map(session => `
                        <div class="session">
                            <h3>Session Details</h3>
                            <p><strong>Student Name:</strong> ${session.studentName}</p>
                            <p><strong>Email:</strong> ${session.gmail}</p>
                            <p><strong>Tutor Name:</strong> ${session.tutorName}</p>
                            <p><strong>Module:</strong> ${session.module}</p>
                            <p><strong>Date:</strong> ${session.date}</p>
                            <p><strong>Start Time:</strong> ${session.startTime}</p>
                            <p><strong>End Time:</strong> ${session.endTime}</p>
                        </div>
                    `).join('')}
                </body>
            </html>
        `);
        printWindow.document.close();
        
        // Wait for content to load before printing
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    // Filter sessions based on search term and filter
    const filteredSessions = sessions.filter(session => {
        const matchesSearch = session.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             session.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             session.module.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filter === 'all') return matchesSearch;
        if (filter === 'recent') {
            // Assuming you have a date field to filter recent sessions
            return matchesSearch; // Add your recent filtering logic here
        }
        return matchesSearch;
    });

    return (
        <div className="session-details-container">
            <div className="page-header">
                <h1>Session Booking Details</h1>
                <p className="page-subtitle">View and manage all your tutoring sessions in one place</p>
                
                <div className="session-stats">
                    <div className="stat-item">
                        <span className="stat-number">{sessions.length}</span>
                        <span className="stat-label">Total Sessions</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{filteredSessions.length}</span>
                        <span className="stat-label">Filtered Sessions</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">
                            {sessions.filter(s => new Date(s.date) > new Date()).length}
                        </span>
                        <span className="stat-label">Upcoming</span>
                    </div>
                </div>
            </div>
            
            <div className="download-section">
                <button onClick={handlePrint} className="download-button">
                    📄 Download Report
                </button>
            </div>

            <div className="controls-section">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search sessions..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <select 
                    className="filter-select" 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Sessions</option>
                    <option value="recent">Recent Sessions</option>
                </select>
            </div>

            <div className="sessions-list">
                {filteredSessions.length === 0 ? (
                    <div className="no-sessions-container">
                        <div className="no-sessions-icon">📅</div>
                        <p className="no-sessions-message">No sessions found</p>
                        <p className="no-sessions-help">
                            {sessions.length === 0 
                                ? "You haven't created any sessions yet. Add sessions to see them here." 
                                : "Try adjusting your search or filter to find what you're looking for."}
                        </p>
                    </div>
                ) : (
                    filteredSessions.map((session) => (
                        <DisplaySession key={session._id} session={session} />
                    ))
                )}
            </div>
        </div>
    );
}

export default SessionDetails;