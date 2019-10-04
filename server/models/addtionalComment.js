const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AdditionalCommentSchema = new Schema({
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
    schedule_id: {
        type: Schema.Types.ObjectId,
        ref: 'Schedule'
    },
    comment: {
        type: String
    },
    create_date: {
        type: Date,
        default: Date.now
    },
    update_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = AdditionalComment = mongoose.model("AdditionalComment", AdditionalCommentSchema);
