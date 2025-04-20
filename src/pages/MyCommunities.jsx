import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SidebarLeft';
import VerticalCard from '../components/VerticalCard';
import axios from 'axios';
import { Menu, X } from 'lucide-react';

const MyCommunities = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('admin'); // 'admin' | 'voter'
  const [communities, setCommunities] = useState({ admin: [], user: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your communities.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5001/myCommunity', {
          headers: {
            'token': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setCommunities(response.data); // { admin: [{ collectionName, key }], user: [{ collectionName, key }] }
      } catch (error) {
        console.error('Error fetching communities:', error);
        setError('Failed to load communities. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const validateCommunityName = (name) => {
    // No spaces or numbers, only letters
    return /^[a-zA-Z]+$/.test(name);
  };

  const getDisplayedCommunities = () => {
    let communitiesToShow = role === 'admin' ? communities.admin : [...communities.user, ...communities.admin];
    // Filter out communities with invalid names
    return communitiesToShow.filter((community) => validateCommunityName(community.collectionName));
  };

  const displayedCommunities = getDisplayedCommunities();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-64 bg-white shadow-lg">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile (Overlay) */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:hidden z-50`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleSidebar}
            aria-label="Close sidebar"
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden text-gray-600 hover:text-gray-800"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {role === 'admin' ? 'My Created Communities' : 'My Joined Communities'}
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setRole('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                role === 'admin'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setRole('voter')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                role === 'voter'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Voter
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg
              className="animate-spin h-8 w-8 text-indigo-600"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center text-lg">{error}</p>
        ) : displayedCommunities.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">
            No valid communities found for <span className="font-semibold">{role}</span> role.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCommunities.map((community, index) => (
              <VerticalCard
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 max-w-md mx-auto"
              >
                <div className="p-6 text-center">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {community.collectionName}
                  </h2>
                  {role === 'admin' && (
                    <button
                      onClick={() => {
                        localStorage.setItem('selectedCommunityKey', community.key);
                        navigate(`/communities/${community.collectionName}/manage`);
                      }}
                      className="w-full bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
                    >
                      Start Election
                    </button>
                  )}
                </div>
              </VerticalCard>
            ))}
          </div>
        )}
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default MyCommunities;