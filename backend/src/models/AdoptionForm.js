const mongoose = require('mongoose');

const adoptionFormSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  hasExperience: {
    type: Boolean,
    required: true
  },
  livingConditions: {
    type: String,
    required: true
  },
  additionalNotes: {
    type: String
  },
  status: {
    type: String,
    enum: ['Beklemede', 'Onaylandı', 'Reddedildi'],
    default: 'Beklemede'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AdoptionForm', adoptionFormSchema); 