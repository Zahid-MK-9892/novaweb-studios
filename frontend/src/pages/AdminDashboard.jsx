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
     LOAD LEADS (WITH TOKEN)
  ============================ */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No admin token found");
      return;
    }

    fetch(`${API_BASE_URL}/api/admin/leads`, {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch leads");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Leads loaded:", data);
        setLeads(data);
      })
      .catch((err) => console.error("Lead fetch error:", err));
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
    const token = localStorage.getItem("token");

    await fetch(`${API_BASE_URL}/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ status }),
    });

    setLeads((prev) =>
      prev.map((l) =>
        l._id === id ? { ...l, status } : l
      )
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      {/* ===========================
          ADD PORTFOLIO
      ============================ */}
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
          LEAD CRM TABLE
      ============================ */}
      <h2>📋 Lead CRM</h2>

      {leads.length === 0 ? (
        <p>No leads yet.</p>
      ) : (
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
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.message}</td>
                <td>
                  <select
                    value={lead.status}
                    onChange={(e) =>
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
      )}
    </div>
  );
}
