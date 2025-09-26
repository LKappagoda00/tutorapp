
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./InstructorsPage.css";

function InstructorsPage() {
    const navigate = useNavigate();
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedModule, setSelectedModule] = useState("all");

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
                            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
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
                            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
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
                            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
                        },
                        {
                            id: 4,
                            name: "Dr. James Wilson",
                            email: "j.wilson@university.edu",
                            modules: ["Chemistry", "Organic Chemistry", "Biochemistry"],
                            bio: "Award-winning chemistry professor with research published in top scientific journals. Focuses on practical applications.",
                            availableSlots: [
                                { date: "2023-10-15", times: ["13:00", "15:00", "17:00"] },
                                { date: "2023-10-17", times: ["10:00", "14:00", "16:00"] },
                                { date: "2023-10-18", times: ["09:00", "11:00", "13:00"] }
                            ],
                            rating: 4.6,
                            reviews: 78,
                            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
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

    // Get all unique modules for filter
    const allModules = [...new Set(instructors.flatMap(instructor => instructor.modules))];

    // Filter instructors based on search and module selection
    const filteredInstructors = instructors.filter(instructor => {
        const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             instructor.modules.some(module => module.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesModule = selectedModule === "all" || instructor.modules.includes(selectedModule);
        
        return matchesSearch && matchesModule;
    });

    if (loading) {
        return (
            <div className="instructors-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading our expert instructors...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="instructors-container">
                <div className="error-message">
                    <h2>Oops! Something went wrong.</h2>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="retry-btn">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="instructors-container">
            <div className="instructors-header">
                <h1>Meet Our Expert Instructors</h1>
                <p>Book one-on-one sessions with our qualified tutors to enhance your learning experience</p>
                
                <div className="filters-container">
                    <div className="search-box">
                        <i className="search-icon">🔍</i>
                        <input 
                            type="text" 
                            placeholder="Search instructors or subjects..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="module-filter">
                        <select 
                            value={selectedModule} 
                            onChange={(e) => setSelectedModule(e.target.value)}
                        >
                            <option value="all">All Subjects</option>
                            {allModules.map((module, index) => (
                                <option key={index} value={module}>{module}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="instructors-grid">
                {filteredInstructors.map(instructor => (
                    <div key={instructor.id} className="instructor-card">
                        <div className="card-header">
                            <div className="instructor-image">
                                <img src={instructor.image} alt={instructor.name} />
                                <div className="rating-badge">
                                    <span className="star">★</span> {instructor.rating}
                                </div>
                            </div>
                            <div className="instructor-info">
                                <h2>{instructor.name}</h2>
                                <p className="instructor-email">{instructor.email}</p>
                                <div className="instructor-rating">
                                    <div className="stars">
                                        {"★".repeat(Math.floor(instructor.rating))}
                                        {instructor.rating % 1 >= 0.5 ? "½" : ""}
                                    </div>
                                    <span className="rating-text">({instructor.reviews} reviews)</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="instructor-bio">
                            <p>{instructor.bio}</p>
                        </div>
                        
                        <div className="modules-section">
                            <h3>Subjects Taught</h3>
                            <div className="modules-list">
                                {instructor.modules.map((module, index) => (
                                    <span key={index} className="module-tag">{module}</span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="availability-section">
                            <h3>Next Available Sessions</h3>
                            <div className="availability-slots">
                                {instructor.availableSlots.slice(0, 2).map((slot, index) => (
                                    <div key={index} className="time-slot">
                                        <div className="slot-date">{new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                        <div className="slot-times">
                                            {slot.times.map((time, timeIndex) => (
                                                <span key={timeIndex} className="time-chip">{time}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <button 
                            className="book-session-btn"
                            onClick={() => handleBookSession(instructor)}
                        >
                            <span className="btn-icon">+</span>
                            Book Session with {instructor.name.split(' ')[0]}
                        </button>
                    </div>
                ))}
            </div>

            {filteredInstructors.length === 0 && (
                <div className="no-results">
                    <h3>No instructors found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            )}
        </div>
    );
}

export default InstructorsPage;