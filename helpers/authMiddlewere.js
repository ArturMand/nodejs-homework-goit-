const jwt = require("jsonwebtoken");
const User = require("../db/modelUser");
const authMiddlewere = async (req, res, next) => {
  const token = req.headers?.authorization.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "not authorized" });
  }
  try {
    const { id } = jwt.verify(token, process.env.JWT_SALT);
    const user = await User.findById(id);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Authorization failed" });
  }
};

module.exports = authMiddlewere;
