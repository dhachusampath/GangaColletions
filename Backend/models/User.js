const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false, // Only for email/password registration
      default: null, // Set default to null if not provided
    },
    googleId: {
      type: String,
      required: false, // Only for Google OAuth login
      default: "", // Set default to empty string if not provided
    },
    isRetailer: {
      type: Boolean,
      default: true, // Default to retailer status as true
    },

    phone: {
      type: String,
      required: false, // Optional field for phone number
      default: "", // Default to empty string if not provided
    },
    profileImage: {
      type: String,
      required: false, // Optional field for profile image
      default: "", // Default to empty string if not provided
    },

    resetPasswordOTP: String,
    resetPasswordOTPExpiry:Date,
    resetPasswordToken:String,
    resetPasswordExpires:Date,
    passwordChangedAt:Date
  },
  { timestamps: true,

    toJSON:{virtuals:true},
    toObject:{virtuals:true},
   }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
