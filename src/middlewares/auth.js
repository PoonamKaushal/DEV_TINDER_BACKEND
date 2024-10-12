const adminAuth = (err, req, res, next) => {
  try {
    const token = "abc";
    const isAdminAuthrized = token === "abc";
    if (!isAdminAuthrized) {
      res.status(401).send("Unauthorized user.");
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};

const userAuth = (err, req, res, next) => {
  try {
    const token = "abc";
    const isUserAuthrized = token === "abc";
    if (!isUserAuthrized) {
      res.status(401).send("Unauthorized user.");
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
