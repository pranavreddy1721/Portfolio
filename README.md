<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=2b6cb0&height=200&section=header&text=Personal%20Portfolio&fontSize=50&fontColor=ffffff&fontAlignY=38&desc=Showcase%20%E2%80%A2%20Connect%20%E2%80%A2%20Grow&descAlignY=58&descSize=20&animation=fadeIn" width="100%" />

<br/>

<p>
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4.19-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>
<p>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
</p>

> A full-stack personal portfolio with a **public site** for visitors and a **protected admin dashboard**
> for managing projects and contact messages — no database GUI or code changes needed to update content.

</div>

---

## ✨ Features

- **Public Portfolio** — About, Skills, Projects (loaded dynamically from the database), Contact form
- **Admin Dashboard** — single-admin login (JWT), add/edit/delete projects, view & manage contact messages
- **Full CRUD** — projects and messages both stored in MongoDB, managed entirely through the UI
- **No frameworks** — plain HTML, CSS, and JavaScript frontend

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (Fetch API) |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt (single admin account, seeded from `.env`) |

---

## 🗂️ Project Structure

```
portfolio/
├── backend/
│   ├── config/db.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Project.js
│   │   └── Message.js
│   ├── middleware/authMiddleware.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── messageController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── messageRoutes.js
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── index.html            # Public portfolio site
│   ├── admin-login.html      # Admin login
│   ├── admin.html            # Admin dashboard (projects + messages)
│   ├── css/style.css
│   └── js/
│       ├── api.js
│       ├── main.js
│       ├── admin-login.js
│       └── admin-dashboard.js
└── README.md
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|:---:|---|:---:|---|
| `POST` | `/api/auth/login` | ❌ | Admin login |
| `GET` | `/api/projects` | ❌ | List all projects (public) |
| `POST` | `/api/projects` | ✅ | Create a project |
| `PUT` | `/api/projects/:id` | ✅ | Update a project |
| `DELETE` | `/api/projects/:id` | ✅ | Delete a project |
| `POST` | `/api/messages` | ❌ | Submit contact form (public) |
| `GET` | `/api/messages` | ✅ | View all messages |
| `PUT` | `/api/messages/:id/read` | ✅ | Mark message as read |
| `DELETE` | `/api/messages/:id` | ✅ | Delete a message |

---

## 🚀 Getting Started

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
```
Fill in `.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=choose_a_strong_password
PORT=5000
```
```bash
npm run dev
```
On first run, this automatically creates your admin account from the `.env` credentials — no separate signup step.

### 2. Frontend
```bash
cd ../frontend
npx http-server -p 5500
```
Visit `http://localhost:5500` for the public site, and `http://localhost:5500/admin-login.html` to manage content.

> ⚠️ Update `API_BASE_URL` in `frontend/js/api.js` to match your backend URL (local or deployed).

---

## 🔐 How Admin Auth Works

There's no public registration — the **only** admin account is created automatically the first time the server starts, using the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env`. Logging in returns a JWT, stored in `localStorage`, and sent as `Authorization: Bearer <token>` on every project/message management request. Public visitors never touch this — they only hit the public `GET /api/projects` and `POST /api/messages` routes.

---

## 👤 Author

**Pranav Reddy** — [GitHub](https://github.com/pranavreddy1721) · [LinkedIn](https://linkedin.com/in/pranavreddy1721)

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=2b6cb0&height=100&section=footer" width="100%" />
</div>
