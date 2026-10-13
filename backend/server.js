require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const User = require("./models/User");
const Scheme = require("./models/Scheme");

const authRoutes =
  require("./routes/auth");

const schemeRoutes =
  require("./routes/scheme");

const eligibilityRoutes =
  require("./routes/eligibility");

const contactRoutes =
  require("./routes/contact");

const app = express();

const PORT =
  process.env.PORT || 5000;

/*
  MIDDLEWARE
*/
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(
  express.json({
    limit: "2mb"
  })
);

app.use(
  express.urlencoded({
    extended: true
  })
);

/*
  HEALTH CHECK
*/
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SchemeSaathi API is running",
    time: new Date().toISOString()
  });
});

/*
  API ROUTES
*/
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/schemes",
  schemeRoutes
);

app.use(
  "/api/eligibility",
  eligibilityRoutes
);

app.use(
  "/api/contact",
  contactRoutes
);

/*
  FRONTEND
*/
app.get("/", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "index.html"
    )
  );
});

/*
  OPTIONAL STATIC FILES
*/
app.use(
  express.static(
    path.join(
      __dirname,
      ".."
    )
  )
);

/*
  404 API
*/
app.use(
  "/api",
  (req, res) => {
    res.status(404).json({
      success: false,
      message: "API endpoint not found"
    });
  }
);

/*
  ERROR HANDLER
*/
app.use(
  (error, req, res, next) => {
    console.error(
      "Server error:",
      error
    );

    res.status(
      error.status || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Internal server error"
    });
  }
);

/*
  SEED DEFAULT SCHEMES
*/
async function seedSchemes() {
  try {
    const count =
      await Scheme.countDocuments();

    if (count > 0) {
      console.log(
        `📦 ${count} schemes already available`
      );
      return;
    }

    const defaultSchemes = [
      {
        name:
          "Student Education Support",
        description:
          "Education assistance for eligible students.",
        category:
          "Education",
        occupation:
          "Student",
        maxIncome:
          800000,
        minAge:
          14,
        maxAge:
          30,
        residence:
          "All",
        state:
          "All",
        benefits:
          "Education and scholarship support",
        officialUrl:
          "https://scholarships.gov.in",
        active:
          true
      },

      {
        name:
          "Farmer Support Scheme",
        description:
          "Financial support for eligible farmers.",
        category:
          "Agriculture",
        occupation:
          "Farmer",
        maxIncome:
          500000,
        minAge:
          18,
        maxAge:
          75,
        residence:
          "All",
        state:
          "All",
        benefits:
          "Agricultural financial assistance",
        officialUrl:
          "https://pmkisan.gov.in",
        active:
          true
      },

      {
        name:
          "Rural Development Support",
        description:
          "Support for eligible rural households.",
        category:
          "Rural Development",
        occupation:
          "All",
        maxIncome:
          500000,
        minAge:
          18,
        maxAge:
          120,
        residence:
          "Rural",
        state:
          "All",
        benefits:
          "Rural development assistance",
        officialUrl:
          "https://www.india.gov.in",
        active:
          true
      },

      {
        name:
          "Income Based Assistance",
        description:
          "Income-based assistance for eligible citizens.",
        category:
          "Financial Assistance",
        occupation:
          "All",
        maxIncome:
          300000,
        minAge:
          18,
        maxAge:
          120,
        residence:
          "All",
        state:
          "All",
        benefits:
          "Financial assistance",
        officialUrl:
          "https://www.india.gov.in",
        active:
          true
      },

      {
        name:
          "Women Empowerment Support",
        description:
          "Support program for eligible women.",
        category:
          "Women & Child",
        occupation:
          "All",
        maxIncome:
          600000,
        minAge:
          18,
        maxAge:
          120,
        residence:
          "All",
        state:
          "All",
        benefits:
          "Women empowerment support",
        officialUrl:
          "https://www.india.gov.in",
        active:
          true
      }
    ];

    await Scheme.insertMany(
      defaultSchemes
    );

    console.log(
      "🌱 Default schemes inserted"
    );
  } catch (error) {
    console.error(
      "Seed error:",
      error.message
    );
  }
}

/*
  DATABASE + SERVER
*/
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing in .env"
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is missing in .env"
      );
    }

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "✅ MongoDB connected"
    );

    await seedSchemes();

    app.listen(
      PORT,
      () => {
        console.log("");
        console.log(
          "======================================"
        );
        console.log(
          "🚀 SchemeSaathi Server Running"
        );
        console.log(
          "======================================"
        );
        console.log(
          `👉 http://localhost:${PORT}`
        );
        console.log(
          `👉 http://localhost:${PORT}/api/health`
        );
        console.log(
          "======================================"
        );
      }
    );
  } catch (error) {
    console.error("");
    console.error(
      "❌ SERVER START FAILED"
    );
    console.error(
      error.message
    );
    console.error("");
    process.exit(1);
  }
}

startServer();