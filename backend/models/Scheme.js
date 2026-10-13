const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true,
      default: "General"
    },

    occupation: {
      type: String,
      default: "All"
    },

    maxIncome: {
      type: Number,
      default: 0
    },

    minAge: {
      type: Number,
      default: 0
    },

    maxAge: {
      type: Number,
      default: 120
    },

    residence: {
      type: String,
      default: "All"
    },

    state: {
      type: String,
      default: "All"
    },

    benefits: {
      type: String,
      default: ""
    },

    officialUrl: {
      type: String,
      default: ""
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Scheme", schemeSchema);