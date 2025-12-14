import mongoose from "mongoose";
import { Admin } from "../models/admin.model.js";
import "dotenv/config.js";
import { DB_NAME } from "../constants.js";

const createAdmin = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("Connected to database");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    const admin = await Admin.create({
      username: "admin",
      password: "admin123", // Will be hashed automatically
      email: "admin@gourmetmarketplace.com",
      role: "admin",
      isActive: true
    });

    console.log("✅ Admin created successfully!");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("\n⚠️  Please change the password after first login!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();

