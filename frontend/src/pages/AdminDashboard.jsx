import { useEffect, useState } from "react";
import { addPortfolio } from "../api";
import { API_BASE_URL } from "../utils/config";

export default function AdminDashboard() {
  /* ===========================
     PORTFOLIO STATE
  ============================ */
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  /* ===========================
     LEADS STATE
  ============================ */
  const [leads, setLeads] = useState([]);

  /* ===========================
     LOAD LEADS
  ============================ */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/leads`)
      .then(res => res.json())
      .then(setLeads)
      .catch(err => console.error("Lead fetch error:", err));
  }, []);

  /* ===========================
     ADD PORTFOLIO
  ============================ */
  const handlePortfolioSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await addPortfolio(
      { title, category, description },
      token
    );

    alert("Portfolio item added");

    setTitle("");
    setCategory("");
    setDescription("");
  };

  /* ===========================
     UPDATE LEAD STATUS
  ============================ */
  const updateStatus = async (id, status) => {
    await fetch(`${API_BASE_URL}/api/admin/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    setLeads(leads.map(l =>
      l._id === id ? { ...l, status } : l
    ));
  };

  return (
    <div style={{ padding: 20 }}>

      {/* ===========================
          PORTFOLIO SECTION
      ============================ */}
      <h1>Admin Dashboard</h1>
      <h2>Add Portfolio Item</h2>

      <form onSubmit={handlePortfolioSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit">Add Portfolio</button>
      </form>

      <hr style={{ margin: "40px 0" }} />

      {/* ===========================
          CRM LEADS SECTION
      ============================ */}
      <h2>📋 Lead CRM</h2>

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Status</th>
            <th>Received</th>
          </tr>
        </thead>

        <tbody>
          {leads.map(lead => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.message}</td>
              <td>
                <select
                  value={lead.status}
                  onChange={e =>
                    updateStatus(lead._id, e.target.value)
                  }
                >
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Qualified</option>
                  <option>Closed</option>
                </select>
              </td>
              <td>
                {new Date(lead.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
