
import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../api/client.js';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken());

  useEffect(() => {
    if (!getToken()) return;

    api
      .get('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const d = await api.post('/auth/login', { email, password });
    setToken(d.token);
    setUser(d.user);
  }

  async function startRegistration(form) {
    return api.post('/auth/register/start', form);
  }

  async function verifyRegistration(email, code) {
    const d = await api.post('/auth/register/verify', { email, code });
    setToken(d.token);
    setUser(d.user);
    return d;
  }

  async function startPasswordReset(email) {
    return api.post('/auth/password/forgot', { email });
  }

  async function verifyPasswordReset(email, code) {
    return api.post('/auth/password/verify', { email, code });
  }

  async function resetPassword(resetToken, newPassword) {
    return api.post('/auth/password/reset', {
      resetToken,
      newPassword,
    });
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        startRegistration,
        verifyRegistration,
        startPasswordReset,
        verifyPasswordReset,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
