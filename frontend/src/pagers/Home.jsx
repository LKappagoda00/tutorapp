import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Home = () => {
    return (
        <>
        <Header />
        <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
                    {/* Hero Section */}
                    <section className="flex flex-col items-center w-full max-w-4xl px-4 py-12 mx-auto text-center">
                        <div className="relative w-full">
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 blur-2xl opacity-40 animate-pulse"></div>
                            <div className="relative z-10">
                                <h1 className="mb-6 text-5xl font-extrabold text-transparent md:text-6xl bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg animate-fade-in">
                                    Welcome to TutorApp
                                </h1>
                                <p className="mb-8 text-lg font-medium text-gray-700 delay-200 md:text-2xl animate-fade-in">
                                    Your one-stop solution for managing tuition, students, teachers, and payments. Empowering education, one click at a time.
                                </p>
                                <div className="flex flex-col justify-center gap-4 md:flex-row animate-fade-in delay-400">
                                    <a href="/login" className="px-8 py-3 font-semibold text-white transition-all duration-300 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700">
                                        Get Started
                                    </a>
                                    <a href="#features" className="px-8 py-3 font-semibold text-blue-600 transition-all duration-300 bg-white border border-blue-600 rounded-lg shadow-lg hover:bg-blue-50">
                                        Learn More
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section id="features" className="grid w-full max-w-5xl grid-cols-1 gap-8 px-4 py-10 mx-auto md:grid-cols-3">
                        <div className="flex flex-col items-center p-8 transition-transform duration-300 bg-white shadow-xl rounded-2xl hover:scale-105 animate-fade-in-up">
                            <div className="mb-4 text-4xl text-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-blue-700">Student Management</h3>
                            <p className="text-gray-600">Easily track student progress, marks, and profiles. Empower students to take charge of their learning journey.</p>
                        </div>
                        <div className="flex flex-col items-center p-8 transition-transform duration-300 delay-200 bg-white shadow-xl rounded-2xl hover:scale-105 animate-fade-in-up">
                            <div className="mb-4 text-4xl text-purple-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7V3m0 0a1 1 0 00-1-1h-6a1 1 0 00-1 1v4m8 0H8m8 0v4m0 0a1 1 0 01-1 1h-6a1 1 0 01-1-1V7m8 4H8" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-purple-700">Teacher Dashboard</h3>
                            <p className="text-gray-600">Give teachers the tools to manage classes, salaries, and student marks with ease and efficiency.</p>
                        </div>
                        <div className="flex flex-col items-center p-8 transition-transform duration-300 bg-white shadow-xl rounded-2xl hover:scale-105 animate-fade-in-up delay-400">
                            <div className="mb-4 text-4xl text-pink-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-pink-700">Payments & Security</h3>
                            <p className="text-gray-600">Manage payments securely and transparently. Parents and students can pay fees online with confidence.</p>
                        </div>
                    </section>

                    {/* Call to Action Section */}
                    <section className="flex flex-col items-center w-full max-w-4xl px-4 py-12 mx-auto text-center">
                        <div className="p-8 shadow-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl animate-fade-in-up">
                            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Ready to transform your tuition experience?</h2>
                            <p className="mb-6 text-lg text-white">Join TutorApp today and unlock the power of seamless tuition management for students, teachers, and parents.</p>
                            <a href="/login" className="px-8 py-3 font-semibold text-blue-600 transition-all duration-300 bg-white rounded-lg shadow-lg hover:bg-blue-50">
                                Sign Up Now
                            </a>
                        </div>
                    </section>

                    {/* Custom Animations */}
                    <style>{`
                        .animate-fade-in {
                            animation: fadeIn 1s ease both;
                        }
                        .animate-fade-in-up {
                            animation: fadeInUp 1s ease both;
                        }
                        .animate-fade-in.delay-200 {
                            animation-delay: 0.2s;
                        }
                        .animate-fade-in.delay-400 {
                            animation-delay: 0.4s;
                        }
                        .animate-fade-in-up.delay-200 {
                            animation-delay: 0.2s;
                        }
                        .animate-fade-in-up.delay-400 {
                            animation-delay: 0.4s;
                        }
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes fadeInUp {
                            from { opacity: 0; transform: translateY(40px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>
                </main>
        </>
    );
};

export default Home;