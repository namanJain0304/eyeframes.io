const mongoose = require("mongoose");
const initData = require("./data.js");
const Eyeframe = require("../models/Eyeframe.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/eyeframes";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Eyeframe.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "672151805b5a0e707d37d103",
  }));
  await Eyeframe.insertMany(initData.data);

  console.log("data was initialized");
};

initDB();
