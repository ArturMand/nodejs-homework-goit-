const fs = require("fs").promises;
const path = require("path");

const getStaticAvatar = async (req, res) => {
  const { reqAvatar } = req.params;
  const avatarPath = path.resolve("public", "avatar", reqAvatar);
  const avatar = await fs.watch(avatarPath);
  res.send(avatar).end();
};

module.exports = {
  getStaticAvatar,
};
