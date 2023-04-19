require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const saveRoutes = require("./routes/saveRoute");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");

connectDB();
const app = express();

const port = process.env.PORT;

app.use(express.json()); // To accept JSON Data

app.use(cors());

app.use("/api", saveRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);


