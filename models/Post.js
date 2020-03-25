const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TechPostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'techUser'
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'techUser'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'techUser'
      },
      name: {
        type: String
      },
      text: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Techpost = mongoose.model('techpost', TechPostSchema);
