// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  kerberosId: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Ensure this line exists
  isAdmin: { type: Boolean, default: false }, // Add this if using admin roles
  // Add additional user fields as needed
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);