const router = require("express").Router();
const users = require("./auth-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res, next) => {
  // implement registration
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  try {
    const saved = await users.add(user);
    res.status(201).json(saved);
    console.log(`User Added`);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  // implement login
  let { username, password } = req.body;

  try {
    const [user] = await users.findBy({ username });
    const passwordValidation = await bcrypt.compare(password, user.password);

    if (!user || !passwordValidation) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }
    const token = jwt.sign(
      {
        userID: user.id,
        userRole: "basic",
      },
      process.env.JWT_SECRET || "secret"
    );
    res.json({
      message: `Welcome ${user.username}`,
      token: token,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
