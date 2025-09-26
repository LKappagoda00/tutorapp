import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisplaySession from '../SessionDisplay/SessionDisplay';

const URL = "http://localhost:5000/bookings";

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

    return (
        <div>
            <div className="session-details-container">
                <button className="print-button" onClick={handlePrint}>Print Sessions</button>
                <div className="session-grid">
                    {sessions.map((session) => (
                        <DisplaySession key={session._id} session={session} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SessionDetails;