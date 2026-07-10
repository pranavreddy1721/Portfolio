const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessages,
  markMessageRead,
  deleteMessage,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(createMessage).get(protect, getMessages);
router.put("/:id/read", protect, markMessageRead);
router.delete("/:id", protect, deleteMessage);

module.exports = router;
