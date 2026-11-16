import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../api/client.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken());

  // Restore the session when the page loads
  useEffect(() => {
    if (!getToken()) return;
    api.get('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const d = await api.post('/auth/login', { email, password });
    setToken(d.token);
    setUser(d.user);
  }

  async function register(form) {
    const d = await api.post('/auth/register', form);
    setToken(d.token);
    setUser(d.user);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
