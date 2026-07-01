import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext({
  userProfile: null,
  setUserProfile: () => {},
});

export function AuthProvider({ children, value }) {
  const [userProfile, setUserProfile] = useState(value?.userProfile ?? null);

  const authValue = useMemo(() => ({ userProfile, setUserProfile }), [userProfile]);

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
