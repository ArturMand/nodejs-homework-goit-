const User = require("../db/modelUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const Jimp = require("jimp");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    const avatarUrl = gravatar.url(email);
    const verificationToken = uuidv4();
    const msg = {
      to: email,
      from: "sviatoslavamar@gmail.com",
      subject: "Please, confirm you email",
      text: `/users/verify/${verificationToken}`,
      html: `<a href='http://localhost:3000/users/verify/${verificationToken}'>Confirm email</a>`,
    };

    await sgMail.send(msg);

    const user = await User.findOneAndUpdate(
      { email },
      {
        name,
        email,
        verificationToken,
        avatarUrl,
        password: await bcrypt.hash(password, 10),
      },
      { upsert: true }
    );
    if (user) {
      res.status(409).json({ message: "This email in the use" });
      return;
    }
    res.status(201).json({ message: "User created" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({
        status: "error",
        code: 409,
        message: "Email in use",
        data: "Conflict",
      });
      return;
    }
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
const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path } = req.file;
  const result = await Jimp.read(path);
  result.cover(250, 250).write(`public/avatars/${_id}`);
  await fs.unlink(path);
  await User.findByIdAndUpdate(_id, { avatarURL: `/avatars/${_id}` });
  res.status(200).json({ avatarURL: `/avatars/${_id}` });
};

const verifyToken = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOneAndUpdate(
    { verificationToken, verify: false },
    { verificationToken: null, verify: true },
    { new: true }
  );
  if (!user) {
    res.status(404).json({
      status: "Not found",
      code: 4004,
      message: "User not found",
    });
  }
  res.status(200).json({
    status: "OK",
    code: 200,
    message: "Verification successful",
  });
};
const verifyEmail = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "missing required field email" });
  }
  const { verificationToken, verify } = await User.findOne({ email });
  if (verify) {
    res.status(400).json({ message: "Verification has already been passed" });
  }
  const msg = {
    to: email,
    from: "sviatoslavamar@gmail.com",
    subject: "Please, confirm you email",
    text: `/users/verify/:${verificationToken}`,
    html: `<a href='http://localhost:3000/users/verify/:${verificationToken}'>Confirm</a>`,
  };
  await sgMail.send(msg);
  res.status(200).json({ message: "Verification email sent" });
};

module.exports = {
  registerUser,
  getUsers,
  loginUser,
  getCurrentUser,
  logOut,
  updateAvatar,
  verifyToken,
  verifyEmail,
};
