const Message = require("../models/Message");

// @route  POST /api/messages
// @desc   PUBLIC — submit a contact form message
const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = await Message.create({ name, email, message });
    res.status(201).json({ message: "Message sent successfully!", id: newMessage._id });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

// @route  GET /api/messages
// @desc   ADMIN ONLY — view all contact form submissions
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};

// @route  PUT /api/messages/:id/read
// @desc   ADMIN ONLY — mark a message as read
const markMessageRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    message.read = true;
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "Error updating message", error: error.message });
  }
};

// @route  DELETE /api/messages/:id
// @desc   ADMIN ONLY — delete a message
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    await message.deleteOne();
    res.json({ message: "Message deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message", error: error.message });
  }
};

module.exports = { createMessage, getMessages, markMessageRead, deleteMessage };
