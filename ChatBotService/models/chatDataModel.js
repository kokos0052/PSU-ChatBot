const mongoose = require("mongoose");

const chatDataModel = mongoose.Schema(
    {
        trainigData: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Feedback",
            }
        ]
    }
);

const ChatData = mongoose.model("ChatData", chatDataModel);

module.exports = ChatData;