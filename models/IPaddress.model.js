// models/IPaddress.model.js
const { Schema, model } = require('mongoose');

const ipaddressSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true
    },
    createdAt: { type: Date, expires: 3600, default: Date.now } //3600s (1h)
  }
);

module.exports = model('IPaddress', ipaddressSchema);