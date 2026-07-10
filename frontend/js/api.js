// Change this if your backend runs on a different URL
const API_BASE_URL = "http://localhost:5000/api";

// Generic fetch wrapper — attaches JWT token (if present) and parses JSON.
// Throws an error with the server's message on failure.
async function apiRequest(endpoint, method = "GET", body = null, useAuth = false) {
  const headers = { "Content-Type": "application/json" };

  if (useAuth) {
    const token = localStorage.getItem("adminToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
