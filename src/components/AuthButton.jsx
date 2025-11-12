import React, {useState} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogIn, LogOut, User, FolderOpen } from 'lucide-react';

const AuthButton = ({onOpenDashboard}) => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  

  if (isLoading) {
    return (
      <div className="px-3 py-1.5 text-sm bg-surface-alt text-text-secondary rounded-lg">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg border border-green-200">
          <User size={16} />
          <span>{user?.email || user?.name || 'User'}</span>
        </div>
        <button
          onClick={onOpenDashboard}
          className="px-3 py-1.5 text-sm bg-primary bg-opacity-10 hover:bg-opacity-20
                     text-primary rounded-lg flex items-center gap-2 transition-colors"
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
          className="px-3 py-1.5 text-sm bg-surface-alt hover:bg-gray-100
                     text-text-secondary rounded-lg flex items-center gap-2 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => loginWithRedirect({
        authorizationParams: {
          prompt: 'login'
        }
      })}
      className="px-3 py-1.5 text-sm bg-primary bg-opacity-10 hover:bg-opacity-20
                 text-primary rounded-lg flex items-center gap-2 transition-colors"
    >
      <LogIn size={16} />
      Sign In
    </button>
  );
};

export default AuthButton;