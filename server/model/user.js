const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the cart schema separately
const cartItemSchema = new Schema({
  id: String,
  title: String,
  price: Number,
  quantity: Number,
  imageUrl: String
});
// Define the product history schema
const productHistorySchema = new Schema({
  items: [cartItemSchema], // items should be an array of itemsSchema
  purchasedAt: { type: Date, default: Date.now }, 
});
// Define the user schema
const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  cart: [cartItemSchema], // Adding cart as an array of cart items
  orders: [productHistorySchema]
});

// Create the User model
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;