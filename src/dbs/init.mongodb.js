"use strict";

const mongoose = require("mongoose");
const {
  db: { host, port, name },
} = require("../config/config.mongodb");
const connectString = `mongodb://${host}:${port}/${name}`;

const { countConnect } = require("../helpers/check.connect");
class Database {
  constructor() {
    this.connect();
  }
  // connect
  connect(type = "mongodb") {
    // if (1 === 1) {
    //   mongoose.set("debug", true);
    //   mongoose.set("debug", { color: true });
    // }
    mongoose
      .connect(connectString, { maxPoolSize: 50 })
      .then(() => console.log("Connected MongoDb Success PRO", countConnect()))
      .catch((err) => console.log(`Error Connect`));
  }
  // singleton pattern
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
