const User = require("../db/modelUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  try {
    const usersList = await User.find({}, " email name subscription");
    res.status(200).json(usersList);
  } catch (err) {
    res.status(500).send("something wrong in db" + err);
  }
};
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { name, email, password: await bcrypt.hash(password, 10) },
      { upsert: true }
    );
    if (user) {
      res.status(409).json({ message: "This email in the use" });
      return;
    }
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(400).json({
      message: `${error}`,
    });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ message: "Email or password is wrong" });
    return;
  }
  const isMatch = bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: "Email or password is wrong" });
    return;
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SALT);
  const data = await User.findOneAndUpdate(
    { email },
    { $set: { token } },
    { new: true }
  );
  res.status(200).json({
    token: data.token,
    email,
    subscription: data.subscription,
    id: user._id,
  });
};

const getCurrentUser = (req, res) => {
  return res.status(200).json(req.user);
};

const logOut = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { $set: { token: null } }, { new: true });
  res.status(204).end();
};

module.exports = {
  registerUser,
  getUsers,
  loginUser,
  getCurrentUser,
  logOut,
};
