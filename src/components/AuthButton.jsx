import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogIn, LogOut, User } from 'lucide-react';

const AuthButton = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();


  // Debug function 
  const testToken = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        }
      });
      console.log('Test token success:', token ? 'Got token' : 'No token');
    } catch (error) {
      console.error('Test token error:', error);
    }
  };

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
          onClick={testToken}
          className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded"
        >
          Test Token
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