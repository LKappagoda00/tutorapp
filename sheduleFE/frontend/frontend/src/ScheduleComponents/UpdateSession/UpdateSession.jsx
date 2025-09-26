import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './UpdateSession.css'; // Import the CSS file

function UpdateSession() {
    const [inputs, setInputs] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const history = useNavigate();
    const id = useParams().id;

    useEffect(() => {
        const fetchHandler = async () => {
            await axios
                .get(`http://localhost:5000/bookings/${id}`)
                .then((res) => res.data)
                .then((data) => setInputs(data.booking))
        };
        fetchHandler();
    }, [id]);

    const sendRequest = async () => {
        await axios
            .put(`http://localhost:5000/bookings/${id}`, {
                studentName: String(inputs.studentName),
                gmail: String(inputs.gmail),
                tutorName: String(inputs.tutorName),
                module: String(inputs.module),
                date: String(inputs.date),
                startTime: String(inputs.startTime),
                endTime: String(inputs.endTime),
            })
            .then((res) => res.data);
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
            sendRequest().then(() => {
                setSubmitStatus('success');
                setTimeout(() => {
                    history('/sessions');
                }, 1500);
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus('error');
            alert("Error updating booking. Please check console for details.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="update-session-container">
            <div className="update-session-header">
                <h1>Update Session</h1>
                <p>Edit the session details below</p>
            </div>

            <form onSubmit={handleSubmit} className="update-session-form">
                <div className="form-group">
                    <label>Student Name</label>
                    <div className="input-with-icon">
                        <span className="input-icon">👤</span>
                        <input
                            className="form-input"
                            type="text"
                            name="studentName"
                            onChange={handleChange}
                            value={inputs.studentName || ''}
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
                            value={inputs.gmail || ''}
                            required
                            placeholder="Enter email address"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Tutor Name</label>
                    <div className="input-with-icon">
                        <span className="input-icon">👨‍🏫</span>
                        <input
                            className="form-input"
                            type="text"
                            name="tutorName"
                            onChange={handleChange}
                            value={inputs.tutorName || ''}
                            required
                            placeholder="Enter tutor name"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Module</label>
                    <div className="input-with-icon">
                        <span className="input-icon">📚</span>
                        <input
                            className="form-input"
                            type="text"
                            name="module"
                            onChange={handleChange}
                            value={inputs.module || ''}
                            required
                            placeholder="Enter module"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Date</label>
                    <div className="input-with-icon">
                        <span className="input-icon">📅</span>
                        <input
                            className="form-input"
                            type="date"
                            name="date"
                            onChange={handleChange}
                            value={inputs.date || ''}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Start Time</label>
                    <div className="input-with-icon">
                        <span className="input-icon">⏰</span>
                        <input
                            className="form-input"
                            type="time"
                            name="startTime"
                            onChange={handleChange}
                            value={inputs.startTime || ''}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>End Time</label>
                    <div className="input-with-icon">
                        <span className="input-icon">⌛</span>
                        <input
                            className="form-input"
                            type="time"
                            name="endTime"
                            onChange={handleChange}
                            value={inputs.endTime || ''}
                            required
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className={`submit-button ${isSubmitting ? 'submitting' : ''} ${submitStatus ? submitStatus : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Session'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UpdateSession;