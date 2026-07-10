// ---------- Guard: must be logged in ----------
const adminToken = localStorage.getItem("adminToken");
if (!adminToken) {
  window.location.href = "admin-login.html";
}

// ---------- Elements ----------
const logoutBtn = document.getElementById("logoutBtn");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

const projectForm = document.getElementById("projectForm");
const projectsList = document.getElementById("projectsList");
const emptyState = document.getElementById("emptyState");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const messagesList = document.getElementById("messagesList");
const messagesEmptyState = document.getElementById("messagesEmptyState");
const unreadBadge = document.getElementById("unreadBadge");

let editingProjectId = null;

// ---------- Logout ----------
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminEmail");
  window.location.href = "admin-login.html";
});

// ---------- Tabs ----------
tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabBtns.forEach((b) => b.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");

    if (btn.dataset.tab === "messagesTab") {
      loadMessages();
    }
  });
});

// ---------- Escape helper ----------
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

// ================= PROJECTS =================

async function loadProjects() {
  try {
    const projects = await apiRequest("/projects", "GET");
    renderProjects(projects);
  } catch (error) {
    console.error("Failed to load projects:", error.message);
    if (error.message.toLowerCase().includes("not authorized")) {
      localStorage.clear();
      window.location.href = "admin-login.html";
    }
  }
}

function renderProjects(projects) {
  projectsList.innerHTML = "";

  if (!projects.length) {
    projectsList.appendChild(emptyState);
    emptyState.style.display = "block";
    return;
  }

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "task-card";

    card.innerHTML = `
      <div class="task-main">
        <div class="task-title">${escapeHtml(project.title)} ${
      project.featured ? '<span class="badge High">Featured</span>' : ""
    }</div>
        <div class="task-desc">${escapeHtml(project.description)}</div>
        <div class="task-meta">
          <span>${(project.techStack || []).join(", ")}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="icon-btn edit-btn" data-id="${project._id}">✏ Edit</button>
        <button class="icon-btn delete delete-btn" data-id="${project._id}">🗑 Delete</button>
      </div>
    `;

    projectsList.appendChild(card);
  });

  attachProjectListeners(projects);
}

projectForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    techStack: document.getElementById("techStack").value.trim(),
    githubUrl: document.getElementById("githubUrl").value.trim(),
    liveUrl: document.getElementById("liveUrl").value.trim(),
    imageUrl: document.getElementById("imageUrl").value.trim(),
    featured: document.getElementById("featured").checked,
    order: Number(document.getElementById("order").value) || 0,
  };

  try {
    if (editingProjectId) {
      await apiRequest(`/projects/${editingProjectId}`, "PUT", payload, true);
    } else {
      await apiRequest("/projects", "POST", payload, true);
    }

    resetForm();
    loadProjects();
  } catch (error) {
    alert(error.message);
  }
});

function attachProjectListeners(projects) {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const project = projects.find((p) => p._id === btn.dataset.id);
      if (!project) return;

      editingProjectId = project._id;
      document.getElementById("title").value = project.title;
      document.getElementById("description").value = project.description;
      document.getElementById("techStack").value = (project.techStack || []).join(", ");
      document.getElementById("githubUrl").value = project.githubUrl || "";
      document.getElementById("liveUrl").value = project.liveUrl || "";
      document.getElementById("imageUrl").value = project.imageUrl || "";
      document.getElementById("featured").checked = !!project.featured;
      document.getElementById("order").value = project.order || 0;

      formTitle.textContent = "Edit Project";
      submitBtn.textContent = "Update Project";
      cancelEditBtn.style.display = "inline-block";

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this project? This cannot be undone.")) return;

      try {
        await apiRequest(`/projects/${btn.dataset.id}`, "DELETE", null, true);
        loadProjects();
      } catch (error) {
        alert(error.message);
      }
    });
  });
}

cancelEditBtn.addEventListener("click", resetForm);

function resetForm() {
  editingProjectId = null;
  projectForm.reset();
  formTitle.textContent = "Add New Project";
  submitBtn.textContent = "Add Project";
  cancelEditBtn.style.display = "none";
}

// ================= MESSAGES =================

async function loadMessages() {
  try {
    const messages = await apiRequest("/messages", "GET", null, true);
    renderMessages(messages);

    const unreadCount = messages.filter((m) => !m.read).length;
    if (unreadCount > 0) {
      unreadBadge.textContent = unreadCount;
      unreadBadge.style.display = "inline-block";
    } else {
      unreadBadge.style.display = "none";
    }
  } catch (error) {
    console.error("Failed to load messages:", error.message);
  }
}

function renderMessages(messages) {
  messagesList.innerHTML = "";

  if (!messages.length) {
    messagesList.appendChild(messagesEmptyState);
    messagesEmptyState.style.display = "block";
    return;
  }

  messages.forEach((msg) => {
    const card = document.createElement("div");
    card.className = `task-card ${!msg.read ? "unread" : ""}`;

    const date = new Date(msg.createdAt).toLocaleString();

    card.innerHTML = `
      <div class="task-main">
        <div class="task-title">${escapeHtml(msg.name)} ${
      !msg.read ? '<span class="badge High">New</span>' : ""
    }</div>
        <div class="task-desc">${escapeHtml(msg.email)}</div>
        <div class="task-desc">${escapeHtml(msg.message)}</div>
        <div class="task-meta"><span>📅 ${date}</span></div>
      </div>
      <div class="task-actions">
        ${
          !msg.read
            ? `<button class="icon-btn mark-read-btn" data-id="${msg._id}">✔ Mark Read</button>`
            : ""
        }
        <button class="icon-btn delete delete-msg-btn" data-id="${msg._id}">🗑 Delete</button>
      </div>
    `;

    messagesList.appendChild(card);
  });

  document.querySelectorAll(".mark-read-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await apiRequest(`/messages/${btn.dataset.id}/read`, "PUT", null, true);
        loadMessages();
      } catch (error) {
        alert(error.message);
      }
    });
  });

  document.querySelectorAll(".delete-msg-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this message?")) return;
      try {
        await apiRequest(`/messages/${btn.dataset.id}`, "DELETE", null, true);
        loadMessages();
      } catch (error) {
        alert(error.message);
      }
    });
  });
}

// ---------- Initial load ----------
loadProjects();
