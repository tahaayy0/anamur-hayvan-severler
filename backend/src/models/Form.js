const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['volunteer', 'adoption', 'contact']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: function() {
      return this.type === 'adoption';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Form', formSchema); 