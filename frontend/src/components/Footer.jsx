import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-3 mt-10 shadow-inner">
      <div className="container mx-auto px-4 text-center">
        <span className="text-white font-semibold">&copy; {new Date().getFullYear()} Tutor App. All rights reserved.</span>
      </div>
    </footer>
  );
}
