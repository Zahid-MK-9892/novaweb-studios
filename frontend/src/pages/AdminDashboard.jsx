import { useEffect, useMemo, useState } from "react";
import { addPortfolio, exportLeadsCsv, getLeadAnalytics, getLeads, updateLead } from "../api";
import { getToken, getUser, logout } from "../utils/auth";
import "./AdminDashboard.css";

const STATUSES = ["New", "Contacted", "Qualified", "Closed"];

export default function AdminDashboard() {
  const token = getToken();
  const user = getUser();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [leads, setLeads] = useState([]);
  const [analytics, setAnalytics] = useState({ total: 0, New: 0, Contacted: 0, Qualified: 0, Closed: 0 });

  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const [notesDraft, setNotesDraft] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const canEditLeads = useMemo(() => ["admin", "manager"].includes(user?.role), [user?.role]);

  const loadLeads = async () => {
    if (!token) return;

    setLoading(true);

    try {
      const response = await getLeads({ token, page, limit, status: statusFilter, search });
      setLeads(response.data);
      setPagination(response.pagination);

      const draftMap = {};
      response.data.forEach((lead) => {
        draftMap[lead._id] = lead.notes || "";
      });
      setNotesDraft(draftMap);
    } catch (error) {
      setMessage("Unable to load leads.");
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    if (!token) return;

    try {
      const data = await getLeadAnalytics(token);
      setAnalytics(data);
    } catch {
      setMessage("Unable to load analytics.");
    }
  };

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    loadLeads();
  };

  const handlePortfolioSubmit = async (event) => {
    event.preventDefault();

    await addPortfolio({ title, category, description }, token);
    setMessage("Portfolio item added successfully.");
    setTitle("");
    setCategory("");
    setDescription("");
  };

  const saveLeadChanges = async (id, payload) => {
    try {
      const updated = await updateLead(token, id, payload);
      setLeads((prev) => prev.map((lead) => (lead._id === id ? updated : lead)));
      setMessage("Lead updated.");
      loadAnalytics();
    } catch {
      setMessage("You do not have permission to update this lead.");
    }
  };

  const downloadCsv = async () => {
    try {
      const csv = await exportLeadsCsv({ token, status: statusFilter });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `leads-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      setMessage("CSV export failed.");
    }
  };

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <h1>NovaWeb Admin Dashboard</h1>
          <p>
            Signed in as <strong>{user?.email || "admin"}</strong> ({user?.role || "admin"})
          </p>
        </div>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => {
            logout();
            window.location.href = "/admin/login";
          }}
        >
          Logout
        </button>
      </header>

      {message && <p className="info-banner">{message}</p>}

      <section className="cards-grid">
        {Object.entries(analytics).map(([key, value]) => (
          <article key={key} className="summary-card">
            <p>{key}</p>
            <h3>{value}</h3>
          </article>
        ))}
      </section>

      <section className="panel">
        <h2>Add Portfolio Item</h2>
        <form className="portfolio-form" onSubmit={handlePortfolioSubmit}>
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit">Add Portfolio</button>
        </form>
      </section>

      <section className="panel">
        <div className="lead-toolbar">
          <h2>Lead CRM</h2>
          <div className="toolbar-actions">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <form onSubmit={handleSearch}>
              <input
                placeholder="Search name/email/message"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            <button type="button" onClick={downloadCsv}>
              Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading leads...</p>
        ) : leads.length === 0 ? (
          <p>No leads found for this filter.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Notes</th>
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
                        disabled={!canEditLeads}
                        value={lead.status}
                        onChange={(e) => saveLeadChanges(lead._id, { status: e.target.value })}
                      >
                        {STATUSES.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <textarea
                        rows="2"
                        value={notesDraft[lead._id] || ""}
                        disabled={!canEditLeads}
                        onChange={(e) =>
                          setNotesDraft((prev) => ({
                            ...prev,
                            [lead._id]: e.target.value,
                          }))
                        }
                      />
                      {canEditLeads && (
                        <button
                          type="button"
                          className="small-btn"
                          onClick={() => saveLeadChanges(lead._id, { notes: notesDraft[lead._id] || "" })}
                        >
                          Save
                        </button>
                      )}
                    </td>
                    <td>{new Date(lead.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="pagination">
          <button type="button" disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages} • {pagination.total} leads
          </span>
          <button
            type="button"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
