import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-4 shadow-lg">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <h1 className="text-3xl font-extrabold text-white tracking-wide drop-shadow-lg">CYBORG SPHERE</h1>
      </div>
    </header>
  );
}
