const mongoose = require("mongoose");

const responsesModel = mongoose.Schema({
    responses: {
        type: Map,
        of: mongoose.Schema.Types.String,
    }
})

const Responses = mongoose.model('Responses', responsesModel);

module.exports = Responses;
