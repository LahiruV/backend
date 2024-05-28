const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    endingdate: {
        type: String,
        required: true
    },
    addedUser: {
        type: Schema.Types.ObjectId,
        ref: "admin",
    },
}, {
    timestamps: true
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
