const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const formRoutes = require("./routes/formRoutes");
require("dotenv").config();

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api", userRoutes);
app.use("/api", formRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
