// src/components/layout/Sidebar.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-indigo-800 text-white w-64 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">ACM Student Chapter</h1>
      </div>
      
      <div className="flex-1">
        <nav className="px-4 pt-4">
          <ul>
            <li className="mb-2">
              <a
                href="/dashboard"
                className="flex items-center px-4 py-2 text-white hover:bg-indigo-700 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Dashboard
              </a>
            </li>
            <li className="mb-2">
              <a
                href="/profile"
                className="flex items-center px-4 py-2 text-white hover:bg-indigo-700 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Profile
              </a>
            </li>
          </ul>
        </nav>
      </div>
      
      <div className="p-4 border-t border-indigo-700">
        <div className="flex items-center mb-4">
          <div className="bg-indigo-600 rounded-full h-10 w-10 flex items-center justify-center mr-3">
            <span className="text-lg font-semibold">{currentUser?.username?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-medium">{currentUser?.username}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7z" clipRule="evenodd" />
            <path d="M3 7a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1zM3 11a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;