import React, { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 left-0 z-50 bg-gradient-to-r from-indigo-900 to-purple-800 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white">Block<span className="text-emerald-400">Vote</span></span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li><a href="#features" className="text-gray-200 hover:text-emerald-300 transition duration-300">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-200 hover:text-emerald-300 transition duration-300">How It Works</a></li>
              <li><a href="#communities" className="text-gray-200 hover:text-emerald-300 transition duration-300">Communities</a></li>
              <li>
                <a href="#" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg">
                  Log In
                </a>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <ul className="flex flex-col space-y-4">
              <li><a href="#features" className="block text-gray-200 hover:text-emerald-300 transition duration-300" onClick={() => setIsMenuOpen(false)}>Features</a></li>
              <li><a href="#how-it-works" className="block text-gray-200 hover:text-emerald-300 transition duration-300" onClick={() => setIsMenuOpen(false)}>How It Works</a></li>
              <li><a href="#communities" className="block text-gray-200 hover:text-emerald-300 transition duration-300" onClick={() => setIsMenuOpen(false)}>Communities</a></li>
              <li>
                <a 
                  href="#" 
                  className="block px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition duration-300 text-center shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}