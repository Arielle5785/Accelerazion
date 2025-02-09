const express = require("express");
// const router = express.Router();
const { sendEmail } = require("./features/emailService.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const allRouter = require("./routes/allRouter.js");
const path = require('path')
require("dotenv").config();

// const { db } = require("./config/db.js");

const app = express();
const { PORT } = process.env;
app.listen(PORT || 5000, () => {
  console.log(`run on ${PORT || 5000}`);
});

// app.use(express.json());
// const bodyParser = require('body-parser');
app.use(express.json()); // Correct spelling and usage

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173','https://accelerazion.onrender.com']
  })
);

app.use("/api", allRouter);




// async function testConnection() {
//   try {
//     const response = await db.raw("select version()");
//     console.log(response.rows);
//   } catch (error) {
//     console.log(error);
//   }
// }
// testConnection()
