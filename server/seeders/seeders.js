const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const Users = require("../models/UserModels");

mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
});

const hashedPassword = bcrypt.hashSync("password1", 10);

const users = [
  {
    username: "admin",
    password: hashedPassword,
    name: "Admin",
    passwordResetExp: new Date(),
    role: "admin",
    company: "PT Berkah Mitra Perdana Sukses",
    alamat: "Perum Puri Pasar Kemis",
  },
  {
    username: "user1",
    password: hashedPassword,
    name: "Parjo",
    passwordResetExp: new Date(),
    role: "user",
    company: "PT Amandina",
    alamat: "jalan tiga raksa",
  },
];

async function seedDatabase() {
  try {
    await Users.insertMany(users);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
