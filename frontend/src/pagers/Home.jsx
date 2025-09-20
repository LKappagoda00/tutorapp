import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Home = () => {
    return (
        <>
        <Header />
        <div className="max-w-2xl mx-auto p-8">
           
            <h1 className="text-3xl font-bold mb-4 text-blue-700">Welcome to TutorApp!</h1>
            
        </div>
        </>
    );
};

export default Home;