import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddSession.css"; // Import the CSS file

function AddSession() {
    const history = useNavigate();
    const [inputs, setInputs] = useState({
        studentName: "",
        gmail: "",
        tutorName: "",
        module: "",
        date: "",
        startTime: "",
        endTime: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', or 'error'

    // Get today's date in YYYY-MM-DD format for the min attribute
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        console.log("Form submitted:", inputs);
        
        try {
            await sendRequest();
            console.log("Booking created successfully");
            setSubmitStatus('success');
            
            // Clear form after successful submission
            setInputs({
                studentName: "",
                gmail: "",
                tutorName: "",
                module: "",
                date: "",
                startTime: "",
                endTime: "",
            });
            
            // Redirect after a short delay
            setTimeout(() => {
                history('/student-payment');
            }, 2000);
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    }

    const sendRequest = async () => {
        const response = await axios.post("http://localhost:5000/api/bookings", {
            studentName: String(inputs.studentName),
            gmail: String(inputs.gmail),
            tutorName: String(inputs.tutorName),
            module: String(inputs.module),
            date: String(inputs.date),
            startTime: String(inputs.startTime),
            endTime: String(inputs.endTime),
        });
        return response.data;
    }

    return (
        <div className="add-session-container">
            <div className="add-session-header">
                <h1>Schedule a New Session</h1>
                <p>Fill out the form below to book a tutoring session with your instructor</p>
            </div>
            
            <form onSubmit={handleSubmit} className="add-session-form">
                <div className="form-group">
                    <label>Student Name</label>
                    <div className="input-with-icon">
                        <span className="input-icon">👤</span>
                        <input 
                            className="form-input"
                            type="text" 
                            name="studentName" 
                            onChange={handleChange} 
                            value={inputs.studentName} 
                            required 
                            placeholder="Enter student name"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-with-icon">
                        <span className="input-icon">✉️</span>
                        <input 
                            className="form-input"
                            type="email"
                            name="gmail" 
                            onChange={handleChange} 
                            value={inputs.gmail} 
                            required 
                            placeholder="Enter email address"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Tutor Name</label>
                    <div className="input-with-icon">
                        <span className="input-icon">🎓</span>
                        <input 
                            className="form-input"
                            type="text" 
                            name="tutorName" 
                            onChange={handleChange} 
                            value={inputs.tutorName} 
                            required 
                            placeholder="Enter tutor name"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Module/Subject</label>
                    <div className="input-with-icon">
                        <span className="input-icon">📚</span>
                        <input 
                            className="form-input"
                            type="text" 
                            name="module" 
                            onChange={handleChange} 
                            value={inputs.module} 
                            required 
                            placeholder="Enter module or subject"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Date</label>
                        <input 
                            className="form-input"
                            type="date"
                            name="date" 
                            onChange={handleChange} 
                            value={inputs.date} 
                            required 
                            min={getTodayDate()} // This blocks earlier dates
                        />
                    </div>

                    <div className="form-group">
                        <label>Start Time</label>
                        <input 
                            className="form-input"
                            type="time"
                            name="startTime" 
                            onChange={handleChange} 
                            value={inputs.startTime} 
                            required 
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>End Time</label>
                    <input 
                        className="form-input"
                        type="time"
                        name="endTime" 
                        onChange={handleChange} 
                        value={inputs.endTime} 
                        required 
                    />
                </div>

                <button 
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="loading-spinner"></span>
                            Scheduling...
                        </>
                    ) : (
                        "Schedule Session"
                    )}
                </button>

                {submitStatus === 'success' && (
                    <div className="success-message">
                        <span>✅</span>
                        Session booked successfully! Redirecting to sessions page...
                    </div>
                )}

                {submitStatus === 'error' && (
                    <div className="error-message">
                        <span>❌</span>
                        Error creating booking. Please try again.
                    </div>
                )}
            </form>
        </div>
    );
}

export default AddSession;

