// Auth utility functions to manage token and user data
export const getStoredToken = () => {
  const tokenData = localStorage.getItem('token');
  if (!tokenData) return null;

  try {
    const { value, expiry } = JSON.parse(tokenData);
    if (new Date().getTime() > expiry) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
    return value;
  } catch {
    localStorage.removeItem('token');
    return null;
  }
};

export const getStoredUser = () => {
  const userData = localStorage.getItem('user');
  if (!userData) return null;

  try {
    return JSON.parse(userData);
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};