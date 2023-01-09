const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL;
mongoose.set("strictQuery", true);

const connectMongo = async () =>
  mongoose
    .connect(MONGO_URL, { useNewUrlParser: true })
    .then(() => console.log("connected to mongo"))
    .catch((err) => {
      console.log(`Error message: ${err.message}`);
      process.exit(1);
    });
module.exports = connectMongo;
