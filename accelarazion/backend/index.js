const express = require("express");
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

app.use(express.json()); // Correct spelling and usage

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    // origin: ['http://localhost:5174','http://localhost:5173','https://accelerazion.onrender.com'|| "*"]
    origin: ['http://localhost:5174'|| "*"]
  })
);

app.use("/api", allRouter);

app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (req, res) => {
  console.log(req);
  res.sendFile(path.resolve(__dirname, "../dist", "index.html"));
});



// async function testConnection() {
//   try {
//     const response = await db.raw("select version()");
//     console.log(response.rows);
//   } catch (error) {
//     console.log(error);
//   }
// }
// testConnection()
