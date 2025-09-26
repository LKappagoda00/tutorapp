import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./InstructorsPage.css";

function InstructorsPage() {
    const navigate = useNavigate();
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                setTimeout(() => {
                    setInstructors([
                        {
                            id: 1,
                            name: "Dr. Sarah Johnson",
                            email: "s.johnson@university.edu",
                            modules: ["Mathematics", "Calculus", "Linear Algebra"],
                            bio: "PhD in Mathematics with 10 years of teaching experience. Specialized in advanced calculus and algebra.",
                            availableSlots: [
                                { date: "2023-10-15", times: ["09:00", "11:00", "14:00"] },
                                { date: "2023-10-16", times: ["10:00", "13:00", "15:00"] },
                                { date: "2023-10-17", times: ["09:30", "11:30", "16:00"] }
                            ],
                            rating: 4.8,
                            reviews: 127,
                            image: "https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
                        },
                        {
                            id: 2,
                            name: "Prof. Michael Chen",
                            email: "m.chen@university.edu",
                            modules: ["Computer Science", "Data Structures", "Algorithms"],
                            bio: "Former software engineer with 8 years of industry experience. Passionate about teaching programming fundamentals.",
                            availableSlots: [
                                { date: "2023-10-15", times: ["10:00", "12:00", "15:00"] },
                                { date: "2023-10-16", times: ["09:00", "11:00", "14:00"] },
                                { date: "2023-10-18", times: ["10:30", "13:30", "16:30"] }
                            ],
                            rating: 4.9,
                            reviews: 94,
                            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
                        },
                        {
                            id: 3,
                            name: "Dr. Emily Williams",
                            email: "e.williams@university.edu",
                            modules: ["Physics", "Mechanics", "Electromagnetism"],
                            bio: "PhD in Physics with research background in quantum mechanics. Enjoys making complex concepts accessible.",
                            availableSlots: [
                                { date: "2023-10-16", times: ["09:00", "12:00", "14:00"] },
                                { date: "2023-10-17", times: ["10:00", "13:00", "15:00"] },
                                { date: "2023-10-19", times: ["11:00", "14:00", "16:00"] }
                            ],
                            rating: 4.7,
                            reviews: 83,
                            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
                        }
                    ]);
                    setLoading(false);
                }, 1000);
            } catch (err) {
                setError("Failed to load instructors");
                setLoading(false);
            }
        };

        fetchInstructors();
    }, []);

    const handleBookSession = (instructor) => {
        console.log("Book session clicked for:", instructor.name);
        
        // Navigate to AddSession page with instructor details
        navigate('/add-session', { 
            state: { 
                tutorName: instructor.name,
                tutorEmail: instructor.email,
                tutorModules: instructor.modules
            }
        });
    };

    if (loading) {
        return (
            <div className="instructors-container">
                <div className="loading-spinner">Loading instructors...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="instructors-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="instructors-container">
            <h1>Our Instructors</h1>
            <div className="instructors-grid">
                {instructors.map((instructor) => (
                    <div key={instructor.id} className="instructor-card">
                        <img src={instructor.image} alt={instructor.name} className="instructor-image" />
                        <h2>{instructor.name}</h2>
                        <p className="instructor-bio">{instructor.bio}</p>
                        <div className="instructor-details">
                            <p><strong>Modules:</strong> {instructor.modules.join(", ")}</p>
                            <p><strong>Email:</strong> {instructor.email}</p>
                        </div>
                        <button onClick={() => handleBookSession(instructor)} className="book-button">
                            Book a Session
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InstructorsPage;