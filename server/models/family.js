const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const FamilySchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  relationship_with_patient: {
    type: String,
    required: true
  },
  approving_authority: {
    type: Boolean,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  create_date: {
    type: Date,
    default: Date.now
  },
  update_date: {
    type: Date,
    default: Date.now
  },
  org_id: {
    type: Schema.Types.ObjectId
  }
});

module.exports = Family = mongoose.model("Family", FamilySchema);
