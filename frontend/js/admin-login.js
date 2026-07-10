// If already logged in, skip straight to the dashboard
if (localStorage.getItem("adminToken")) {
  window.location.href = "admin.html";
}

const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const data = await apiRequest("/auth/login", "POST", { email, password }, false);

    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminEmail", data.email);

    window.location.href = "admin.html";
  } catch (error) {
    errorMsg.textContent = error.message;
  }
});
