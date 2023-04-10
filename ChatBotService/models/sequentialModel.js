const mongoose = require("mongoose");

const sequentialModel = mongoose.Schema({
    model: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
    }
});

const Sequential = mongoose.model('Sequential', sequentialModel);

module.exports = Sequential;
