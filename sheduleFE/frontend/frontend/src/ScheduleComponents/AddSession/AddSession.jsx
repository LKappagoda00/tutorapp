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
                history('/sessions');
            }, 2000);
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    }

    const sendRequest = async () => {
        const response = await axios.post("http://localhost:5000/bookings", {
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
            </form>
        </div>
    );
}

export default AddSession;