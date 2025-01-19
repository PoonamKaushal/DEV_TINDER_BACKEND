const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8888;
// middlewares
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

// delete a user
app.delete("/delete", async (req, res) => {
  const userId = req.body.userId; // this we are getting from req
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Can't delete the user");
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(PORT, () => {
      console.log(`Server is listening to the port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Can't connect to database.");
  });
