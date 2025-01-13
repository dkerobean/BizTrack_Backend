const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "staff"], 
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to hash passwords
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Export the User model
module.exports = mongoose.model("User", userSchema);
