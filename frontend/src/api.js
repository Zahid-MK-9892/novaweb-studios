import { API_BASE_URL } from "./config";

/* CONTACT FORM */
export const sendContact = async (data) => {
  const res = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

/* GET PORTFOLIO */
export const getPortfolio = async () => {
  const res = await fetch(`${API_BASE_URL}/api/portfolio`);
  return res.json();
};

/* ADMIN LOGIN */
export const adminLogin = async (credentials) => {
  const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return res.json();
};

/* ADD PORTFOLIO (ADMIN) */
export const addPortfolio = async (data, token) => {
  const res = await fetch(`${API_BASE_URL}/api/portfolio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
