import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext({
  userProfile: null,
  setUserProfile: () => {},
});

export function AuthProvider({ children, value }) {
  const authValue = useMemo(() => ({
    userProfile: value?.userProfile ?? null,
    setUserProfile: value?.setUserProfile ?? (() => {})
  }), [value?.userProfile, value?.setUserProfile]);

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
