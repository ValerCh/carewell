const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ActivityReportSchema = new Schema({
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
    activity: {
        type: Schema.Types.Mixed
    },
    observation: {
        type: Schema.Types.Mixed
    },
    additionalComment: {
        type: Schema.Types.Mixed
    },
    start_date: {
        type: String
    },
    end_date: {
        type: String
    },
    sign_status: {
        type: Schema.Types.Mixed
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

module.exports = ActivityReport = mongoose.model("ActivityReport", ActivityReportSchema);
