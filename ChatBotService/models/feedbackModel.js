const mongoose = require("mongoose");

const feedbackModel = mongoose.Schema(
    {
        label: {
            type: String,
            require: true,
        },
        input: {
            type: String,
            require: true,
        },
        output: {
            type: String,
            require: true,
        }
    }
)

const Feedback = mongoose.model('Feedback', feedbackModel);

module.exports = Feedback;
