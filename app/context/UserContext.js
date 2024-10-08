// context/userContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [joinedUsers, setJoinedUsers] = useState([]); // State to store joined users
  const [joinedUserDetails, setJoinedUserDetails] = useState({}); // State to store details of joined users
  const [isHydrated, setIsHydrated] = useState(false); // State to track hydration

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('userD');
      const savedUserDetails = localStorage.getItem('joinedUserDetails');

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      if (savedUserDetails) {
        setJoinedUserDetails(JSON.parse(savedUserDetails));
      }

      setIsHydrated(true); // Mark hydration as complete
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('userD', JSON.stringify(user));
      }
      localStorage.setItem('joinedUserDetails', JSON.stringify(joinedUserDetails));
    }
  }, [user, joinedUserDetails]);

  // Only render children after hydration is complete
  if (!isHydrated) {
    return null; // Or return a loading spinner if you prefer
  }

  return (
    <UserContext.Provider value={{ user, setUser, joinedUsers, setJoinedUsers, joinedUserDetails, setJoinedUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
