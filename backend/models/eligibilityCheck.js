const mongoose = require("mongoose");

const eligibilityCheckSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    name: {
      type: String,
      default: ""
    },

    age: {
      type: Number,
      required: true
    },

    income: {
      type: Number,
      required: true
    },

    occupation: {
      type: String,
      required: true
    },

    state: {
      type: String,
      required: true
    },

    residence: {
      type: String,
      required: true
    },

    category: {
      type: String,
      default: "General"
    },

    matchedSchemes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Scheme"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "EligibilityCheck",
  eligibilityCheckSchema
);