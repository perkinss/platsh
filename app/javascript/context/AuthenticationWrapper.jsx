import React, { useEffect, useState, useContext } from 'react';
import User from '../model/user'

export const RootAuthContext = React.createContext();
export default ({ children }) => {
  let anyAuthVal,anyAuthData;
  try {
    anyAuthVal=JSON.parse(window.sessionStorage.getItem('authenticated'));
  }
  catch(err) {
    anyAuthVal=false;
  }
  try {
    anyAuthData = JSON.parse(window.sessionStorage.getItem('authData'))
  }
  catch(err) {
    anyAuthData = null;
  }
  const guestUser = new User({})
  const prevAuth = (anyAuthVal ? anyAuthVal : false);
  const prevAuthData = (anyAuthData ? anyAuthData : null);
  const prevUser = (anyAuthData ? new User(anyAuthData) : guestUser);
  const [authenticated, setAuthenticated] = useState(prevAuth);
  const [authData, setAuthData] = useState(prevAuthData);
  const [currentUser, setCurrentUser] = useState(prevUser);
  useEffect(
    () => {
      window.sessionStorage.setItem('authenticated', JSON.stringify(authenticated));
      window.sessionStorage.setItem('authData', (authData ? JSON.stringify(authData):null));
      setCurrentUser(authData ? new User(authData) : guestUser)
    },
    [authenticated, authData]
  );
  const defaultContext = {
    authenticated, setAuthenticated,
    authData, setAuthData,
    currentUser, setCurrentUser
  };
  return (
    <RootAuthContext.Provider value={defaultContext}>
      {children}
    </RootAuthContext.Provider>
  );
};
