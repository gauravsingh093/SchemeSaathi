const express = require("express");

const Contact =
  require("../models/Contact");

const {
  protect,
  adminOnly
} = require("../middleware/auth");

const router = express.Router();

/*
  PUBLIC CONTACT
*/
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and message are required"
      });
    }

    const contact =
      await Contact.create({
        name,
        email,
        phone: phone || "",
        subject: subject || "",
        message
      });

    res.status(201).json({
      success: true,
      message:
        "Your message has been received",
      contact
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Unable to submit your message"
    });
  }
});

/*
  ADMIN - ALL MESSAGES
*/
router.get(
  "/",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const messages =
        await Contact.find()
          .sort({
            createdAt: -1
          });

      res.json({
        success: true,
        messages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Unable to fetch messages"
      });
    }
  }
);

/*
  ADMIN - UPDATE MESSAGE STATUS
*/
router.patch(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const message =
        await Contact.findByIdAndUpdate(
          req.params.id,
          {
            status: req.body.status
          },
          {
            new: true
          }
        );

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found"
        });
      }

      res.json({
        success: true,
        message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          "Unable to update message"
      });
    }
  }
);

module.exports = router;