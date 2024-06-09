import React, { createContext, useEffect, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(!!localStorage.getItem('id_user') ? 'authorized' : 'unathorized');

  const updateUserRole = (newRole) => {
    setUserRole(newRole);
  };

  const handleSignOut = () => {
    updateUserRole('unauthorized');
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ userRole, updateUserRole, handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
