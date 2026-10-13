const express = require("express");

const Scheme = require("../models/Scheme");
const EligibilityCheck =
  require("../models/eligibilityCheck");

const {
  protect,
  adminOnly
} = require("../middleware/auth");

const router = express.Router();

function matchesScheme(scheme, data) {
  const age = Number(data.age);
  const income = Number(data.income);

  /*
    AGE
  */
  if (
    age < Number(scheme.minAge || 0) ||
    age > Number(scheme.maxAge || 120)
  ) {
    return false;
  }

  /*
    INCOME
    0 = no limit
  */
  if (
    Number(scheme.maxIncome || 0) > 0 &&
    income > Number(scheme.maxIncome)
  ) {
    return false;
  }

  /*
    OCCUPATION
  */
  if (
    scheme.occupation &&
    scheme.occupation.toLowerCase() !== "all"
  ) {
    if (
      scheme.occupation.toLowerCase() !==
      String(data.occupation).toLowerCase()
    ) {
      return false;
    }
  }

  /*
    RESIDENCE
  */
  if (
    scheme.residence &&
    scheme.residence.toLowerCase() !== "all"
  ) {
    if (
      scheme.residence.toLowerCase() !==
      String(data.residence).toLowerCase()
    ) {
      return false;
    }
  }

  /*
    STATE
  */
  if (
    scheme.state &&
    scheme.state.toLowerCase() !== "all"
  ) {
    if (
      scheme.state.toLowerCase() !==
      String(data.state).toLowerCase()
    ) {
      return false;
    }
  }

  return true;
}

/*
  CHECK ELIGIBILITY
*/
router.post(
  "/check",
  protect,
  async (req, res) => {
    try {
      const {
        age,
        income,
        occupation,
        state,
        residence,
        category,
        name
      } = req.body;

      if (
        age === undefined ||
        income === undefined ||
        !occupation ||
        !state ||
        !residence
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Age, income, occupation, state and residence are required"
        });
      }

      const schemes =
        await Scheme.find({
          active: true
        });

      const matched =
        schemes.filter((scheme) =>
          matchesScheme(scheme, {
            age,
            income,
            occupation,
            state,
            residence
          })
        );

      const check =
        await EligibilityCheck.create({
          user:
            req.user.id === "admin"
              ? null
              : req.user.id,

          name: name || req.user.name || "",

          age,
          income,
          occupation,
          state,
          residence,
          category: category || "General",

          matchedSchemes:
            matched.map((scheme) => scheme._id)
        });

      res.json({
        success: true,
        message: "Eligibility check completed",
        checkId: check._id,
        count: matched.length,
        schemes: matched
      });
    } catch (error) {
      console.error(
        "Eligibility error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to perform eligibility check"
      });
    }
  }
);

/*
  ADMIN - ALL CHECKS
*/
router.get(
  "/admin/all",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const checks =
        await EligibilityCheck.find()
          .populate(
            "user",
            "name email"
          )
          .populate(
            "matchedSchemes",
            "name category"
          )
          .sort({
            createdAt: -1
          });

      res.json({
        success: true,
        checks
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Unable to fetch eligibility checks"
      });
    }
  }
);

module.exports = router;