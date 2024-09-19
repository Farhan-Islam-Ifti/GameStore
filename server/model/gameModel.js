const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        data: Buffer,
        contentType: String
      },
    
      // Image filename if uploaded
      imageFileName: {
        type: String,
        required: function() {
          // Required if imageUrl is not provided
          return !this.imageUrl && !this.image.data;
        }
      },
    
      // Image URL if using an external URL
      imageUrl: {
        type: String,
        required: function() {
          // Required if imageFileName or image (binary) is not provided
          return !this.imageFileName && !this.image.data;
        }
      },
    genre: {
        type: String,
        required: true
    },
    platform: {
        type: [String],
        required: true
    },
    developer: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    inStock: {
        type: Boolean,
        default: true
    },
    tags: {
        type: [String],
        default: []
    },
    discountPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);