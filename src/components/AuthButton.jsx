import React, {useState} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogIn, LogOut, User, FolderOpen } from 'lucide-react';

const AuthButton = ({onOpenDashboard}) => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  

  if (isLoading) {
    return (
      <div className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-md">
          <User size={16} />
          <span>{user?.name || user?.email || 'User'}</span>
        </div>
        <button
          onClick={onOpenDashboard}
          className="px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 
                     text-blue-700 rounded-md flex items-center gap-2"
        >
          <FolderOpen size={16} />
          My Sheets
        </button>
        <button
          onClick={() => logout({
            logoutParams: {
              returnTo: window.location.origin
            }
          })}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 
                     text-gray-700 rounded-md flex items-center gap-2"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => loginWithRedirect()}
      className="px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 
                 text-blue-700 rounded-md flex items-center gap-2"
    >
      <LogIn size={16} />
      Sign In
    </button>
  );
};

export default AuthButton;