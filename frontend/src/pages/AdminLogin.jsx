import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api";
import { setAuthSession } from "../utils/auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const data = await adminLogin({ email, password });

    if (data.token) {
      setAuthSession({ token: data.token, user: data.user });
      navigate("/admin");
      return;
    }

    setError(data.message || "Invalid credentials");
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", fontFamily: "Arial, sans-serif" }}>
      <form
        onSubmit={handleLogin}
        style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
      >
        <h1 style={{ marginTop: 0 }}>Admin Login</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 10 }}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 10 }}
          required
        />

        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        <button type="submit" style={{ width: "100%", padding: 10, background: "#111827", color: "white", borderRadius: 8 }}>
          Login
        </button>
      </form>
    </div>
  );
}
