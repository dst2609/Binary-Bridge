// db.js
require("dotenv").config();
const { MongoClient } = require("mongodb");

// MongoDB connection string
const mongoURI = process.env.MONGO_URI;

let db;
let usersCollection;

async function connectToDB() {
  try {
    const client = await MongoClient.connect(mongoURI, {});
    db = client.db("WebAssembler");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

async function createUsersCollection() {
  try {
    usersCollection = db.collection("users");
    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some(
      (collection) => collection.name === "users"
    );
    if (!collectionExists) {
      await usersCollection.createIndex({ title: "text" }); // Optional: Create an index for text search
      console.log("usersCollection collection created");
    }
  } catch (err) {
    console.error("Failed to create usersCollection :", err);
    process.exit(1);
  }
}

function getUsersCollection() {
  return usersCollection;
}

module.exports = {
  connectToDB,
  createUsersCollection,
  getUsersCollection,
};
