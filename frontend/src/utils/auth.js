export const setAuthSession = ({ token, user }) => {
  localStorage.setItem("token", token);
  if (user) {
    localStorage.setItem("adminUser", JSON.stringify(user));
  }
};

export const getToken = () => localStorage.getItem("token");

export const getUser = () => {
  const raw = localStorage.getItem("adminUser");

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("adminUser");
};

export const isAuthenticated = () => !!localStorage.getItem("token");
