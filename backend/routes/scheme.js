const express = require("express");

const Scheme = require("../models/Scheme");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

/*
  GET ALL ACTIVE SCHEMES
*/
router.get("/", async (req, res) => {
  try {
    const schemes = await Scheme.find({
      active: true
    }).sort({
      createdAt: -1
    });

    res.json({
      success: true,
      count: schemes.length,
      schemes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch schemes"
    });
  }
});

/*
  ADMIN - ALL SCHEMES
*/
router.get(
  "/admin/all",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const schemes = await Scheme.find()
        .sort({
          createdAt: -1
        });

      res.json({
        success: true,
        schemes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Unable to fetch schemes"
      });
    }
  }
);

/*
  GET SINGLE SCHEME
*/
router.get("/:id", async (req, res) => {
  try {
    const scheme =
      await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found"
      });
    }

    res.json({
      success: true,
      scheme
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid scheme ID"
    });
  }
});

/*
  ADMIN - CREATE
*/
router.post(
  "/",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const scheme =
        await Scheme.create(req.body);

      res.status(201).json({
        success: true,
        message: "Scheme created successfully",
        scheme
      });
    } catch (error) {
      console.error(error);

      res.status(400).json({
        success: false,
        message: "Unable to create scheme"
      });
    }
  }
);

/*
  ADMIN - UPDATE
*/
router.put(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const scheme =
        await Scheme.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true
          }
        );

      if (!scheme) {
        return res.status(404).json({
          success: false,
          message: "Scheme not found"
        });
      }

      res.json({
        success: true,
        message: "Scheme updated successfully",
        scheme
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Unable to update scheme"
      });
    }
  }
);

/*
  ADMIN - DELETE
*/
router.delete(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const scheme =
        await Scheme.findByIdAndDelete(
          req.params.id
        );

      if (!scheme) {
        return res.status(404).json({
          success: false,
          message: "Scheme not found"
        });
      }

      res.json({
        success: true,
        message: "Scheme deleted successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Unable to delete scheme"
      });
    }
  }
);

module.exports = router;