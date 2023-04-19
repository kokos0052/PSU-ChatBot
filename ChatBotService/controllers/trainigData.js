const ChatData = require("../models/chatDataModel");
const Feedback = require("../models/feedbackModel");
const Responses = require("../models/responsesModel");

async function getTraingData() {
  let trainingData = await ChatData.find().populate("label");

  console.log(trainingData);
  return trainingData;
}

async function updateTraingData(label, input, output) {
  const feedback = await Feedback.create({
    label,
    input,
    output,
  });

  let chatData = await ChatData.create({
    trainigData: [feedback._id],
  });

  if (chatData) {
    await ChatData.findByIdAndUpdate(chatData._id,
      {
        $push: { trainigData: feedback },
      }
    );
  } else {
    chatData = await new ChatData({
      trainigData: [feedback._id],
    });
  }

  

  console.log(`trainigData updated`);
}

async function getResponses() {
  const responses = await Responses.find() || await Responses.create({
    responses: {},
});

  return responses;
}

getTraingData();

module.exports = {
  getTraingData,
  updateTraingData,
  getResponses,
};
