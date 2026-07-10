const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

app.get("/", (req, res) => {
  res.send("Portfolio API is running...");
});

// Creates the admin account from .env credentials if it doesn't exist yet.
// This means there's no public "register" endpoint — only one admin, ever.
const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL.toLowerCase() });
    if (!existingAdmin) {
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });
      console.log(`Admin account created for ${process.env.ADMIN_EMAIL}`);
    } else {
      console.log("Admin account already exists, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding admin account:", error.message);
  }
};

const start = async () => {
  await connectDB();
  await seedAdmin();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();
