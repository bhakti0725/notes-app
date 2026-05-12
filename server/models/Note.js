const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  body: {
    type: String,
    required: [true, 'Body is required'],
    trim: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    default: null
  },
  imagePublicId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);