const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
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
      type: Number,
      required: false,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "staff"],
      default: "user",
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
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

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role }, // Payload
    process.env.JWT_SECRET, // Secret key
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" } // Token expiry
  );
};

// Password comparison method
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Export the User model
module.exports = mongoose.model("User", userSchema);
