import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Block<span className="text-emerald-400">Vote</span></h3>
            <p className="text-gray-300">Empowering communities with transparent blockchain voting solutions.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Features</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition duration-300">Community Creation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition duration-300">Blockchain Security</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition duration-300">Election Management</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition duration-300">Result Analytics</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition duration-300">Documentation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition duration-300">API</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition duration-300">Case Studies</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition duration-300">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition duration-300">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition duration-300">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition duration-300">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition duration-300">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} BlockVote. All rights reserved.
        </div>
      </div>
    </footer>
  );
}