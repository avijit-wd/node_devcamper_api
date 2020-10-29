const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const path = require("path");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
dotenv.config({ path: "./config/config.env" });
const cookieParser = require("cookie-parser");
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const app = express();

app.use(express.json());

app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(fileupload());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

app.use(errorHandler);

connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
      .italic
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});
