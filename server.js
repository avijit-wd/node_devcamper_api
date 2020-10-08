const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
dotenv.config({ path: "./config/config.env" });
const bootcamps = require("./routes/bootcamps");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const app = express();

app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use("/api/v1/bootcamps", bootcamps);

app.use(errorHandler);

connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});
