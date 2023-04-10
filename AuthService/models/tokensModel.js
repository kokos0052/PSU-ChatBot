const  mongoose = require("mongoose");

const tokensModel = mongoose.Schema({
    tokens: [
        {
            type: String,
            require: true,
        }
    ],
});

const Tokens = mongoose.model("Tokens", tokensModel);

module.exports = Tokens;
