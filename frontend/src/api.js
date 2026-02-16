import { API_BASE_URL } from "./utils/config";

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

/* ======================
   CONTACT FORM
====================== */
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

/* ======================
   GET PORTFOLIO
====================== */
export const getPortfolio = async () => {
  const res = await fetch(`${API_BASE_URL}/api/portfolio`);
  return res.json();
};

/* ======================
   ADMIN LOGIN
====================== */
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

/* ======================
   ADD PORTFOLIO (ADMIN)
====================== */
export const addPortfolio = async (data, token) => {
  const res = await fetch(`${API_BASE_URL}/api/portfolio`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });

  return res.json();
};

export const getLeads = async ({ token, page = 1, limit = 10, status = "", search = "" }) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) params.set("status", status);
  if (search) params.set("search", search);

  const res = await fetch(`${API_BASE_URL}/api/admin/leads?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch leads");
  }

  return res.json();
};

export const getLeadAnalytics = async (token) => {
  const res = await fetch(`${API_BASE_URL}/api/admin/leads/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return res.json();
};

export const updateLead = async (token, id, payload) => {
  const res = await fetch(`${API_BASE_URL}/api/admin/leads/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update lead");
  }

  return res.json();
};

export const exportLeadsCsv = async ({ token, status = "" }) => {
  const params = new URLSearchParams();
  if (status) params.set("status", status);

  const res = await fetch(`${API_BASE_URL}/api/admin/leads/export/csv?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to export leads");
  }

  return res.text();
};
