const express = require("express");
const app = express();
const { booksPath, authPath, usersPath } = require("./routes/sort");
const {logger, error, notFound} = require("./middleware/sort")
const connectToDB = require("./config/db");

require("dotenv").config();

connectToDB();

app.use(logger);

app.use(express.json());
app.use("/api/books", booksPath);
app.use("/api/auth", authPath);
app.use("/api/users", usersPath);

app.use(notFound);
app.use(error);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is run on:\n\nhttp://localhost:${PORT}`));