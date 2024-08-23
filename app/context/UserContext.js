// context/userContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false); // State to track hydration

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('userD');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsHydrated(true); // Mark hydration as complete
    }
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if(user){
        localStorage.setItem('userD',JSON.stringify(user));
      }// Mark hydration as complete
    }
  }, [user]);

  // Only render children after hydration is complete
  if (!isHydrated) {
    return null; // Or return a loading spinner if you prefer
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
