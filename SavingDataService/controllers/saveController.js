const Responses = require("../../ChatBotService/models/responsesModel");
const { updateTraingData, getResponses } = require("../../ChatBotService/controllers/trainigData");

async function appendPhrase(req, res) {
    const { input, output, label } = req.body;

    const responses = await Responses.create({
        responses: {},
    });

    console.log(`here2`, responses);

    if (label in responses) {
        throw new Error("Ответ с таким заголовком уже есть в базе данных");
    }

    const updated = await Responses.findByIdAndUpdate(responses._id, {
        responses: {
            ...responses,
            [label]: output,
        }
    });

    const result = updateTraingData(label, input, output);

    console.log(result);

    if (result && updated) {
        res.status(202).json({
            result,
        });
    } else {
        res.status(400);
        throw new Error("При добавлении новой фразы произошла ошибка");
    }

}

module.exports = {
    appendPhrase,
}
