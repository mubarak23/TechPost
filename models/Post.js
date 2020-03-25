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
  postbody: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
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
