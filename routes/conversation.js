const router = require("express").Router();
const Conversation = require("../models/conversation");
const userSchema = require("../models/user");
const adminSchema = require("../models/admin");

// Get all users for create a conversation
router.get("/getAllUsers/:id", async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;
  try {
    //all conversations
    const allConversations = await Conversation.find();

    // if type user send all consultants that are not in a conversation with the user
    if (type === "User") {
      const user = await userSchema.findById(id);
      const allConsultants = await adminSchema.find({ type: "Consultant" });

      const consultants = allConsultants.filter((consultant) => {
        let isConsultant = true;
        allConversations.forEach((conversation) => {
          if (
            conversation.member01.toString() === id ||
            conversation.member02.toString() === id
          ) {
            if (
              conversation.member01.toString() === consultant._id.toString() ||
              conversation.member02.toString() === consultant._id.toString()
            ) {
              isConsultant = false;
            }
          }
        });
        return isConsultant;
      });

      return res.status(200).json(consultants);
    } else {
      const user = await adminSchema.findById(id);
      const allUsers = await userSchema.find();

      const users = allUsers.filter((user) => {
        let isUser = true;
        allConversations.forEach((conversation) => {
          if (
            conversation.member01.toString() === id ||
            conversation.member02.toString() === id
          ) {
            if (
              conversation.member01.toString() === user._id.toString() ||
              conversation.member02.toString() === user._id.toString()
            ) {
              isUser = false;
            }
          }
        });
        return isUser;
      });

      return res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to create a new conversation
router.post("/createConversation", async (req, res) => {
  const { member01, member02 } = req.body;

  try {
    const isConversationExist = await Conversation.find({
      $or: [
        { member01: member01, member02: member02 },
        { member01: member02, member02: member01 },
      ],
    });

    if (isConversationExist.length > 0) {
      return res.status(400).json({ message: "Conversation already exists" });
    }

    const conversation = new Conversation({ member01, member02 });
    await conversation.save();

    return res
      .status(200)
      .json({ message: "Conversation created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all conversations by user id
router.get("/allConversations/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const conversations = await Conversation.find({
      $or: [{ member01: id }, { member02: id }],
    }).populate("member01 member02");

    return res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all messages by conversation id
router.get("/allMessages/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    return res.status(200).json(conversation.messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to send a message
router.post("/createMgs/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  const { senderId, text } = req.body;

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    conversation.messages.push({ senderId, text });
    await conversation.save();

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
