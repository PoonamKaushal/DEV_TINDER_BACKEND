const express = require("express");

const app = express();
const PORT = 8888;

const { adminAuth, userAuth } = require("./middlewares/auth");

app.get("/admin/getData", adminAuth, (req, res) => {
  res.send("All data sent");
});
app.delete("/admin/deleteData", adminAuth, (req, res) => {
  res.send("All data deleted");
});
// THIS WILL ONLY HANDLE GET CALL TO /hello
app.get("/user", userAuth, (req, res) => {
  res.send("Hello, Welcome to our application.");
});
app.get("/user/login", (req, res) => {
  res.send("User Logged in successfully.");
});
// route pattern * means can accept anything between numbers ,? means optional, + means increment,() means group
// /a/ means any rote containing a in string
// /.*fly$/ means start with anything and end with fly
// app.get("/a(b+c)?*d", (req, res) => {
//   res.send("Route testing");
// });

// dynamic route
// app.get("/user/:userId/:userName", (req, res) => {
//   console.log(req.params);
//   res.send("Dynamic routing.");
// });
// app.post("/user", (req, res) => {
//   res.send("Your server is active.");
// });
// app.delete("/user", (req, res) => {
//   res.send("Hlo USER!!");
// });

// THIS WILL MATCH ALL THE HTTP METHOD API CALLS TO /
// Also order matters here if we write this route on top after that any route starting from / always gives this output Hello from dashboard
// app.use("/", (req, res) => {
//   // This is a request handler.
//   res.send("Hello from dashboard.");
// });

// we can have multiple request handler with the help of next function as shown below

app.use("/multi_route_handler", [
  (req, res, next) => {
    // if we would not send the response here and also does not call the next functioona it will go to infinite sending loop
    console.log("1st request handler");
    next();
  },
  (req, res, next) => {
    console.log("2nd request handler");
    next();
    res.send("2nd response"); // this is not a good practice
  },
  (req, res, next) => {
    console.log("3rd request handler");
    res.send("3rd response");
  },
]);
app.listen(PORT, () => {
  console.log(`Server is listening to the port ${PORT}`);
});
