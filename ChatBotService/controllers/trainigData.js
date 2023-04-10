const ChatData = require("../models/chatDataModel");
const Feedback = require("../models/feedbackModel");
const Responses = require("../models/responsesModel");

async function getTraingData() {
  let trainingData = await ChatData.find({}).populate("label");

  console.log(trainingData);
  return trainingData;
}

async function updateTraingData(label, input, output) {
  const feedback = await Feedback.create({
    label,
    input,
    output,
  });

  const chatData = await ChatData.find({});

  const res = await ChatData.findByIdAndUpdate(chatData._id,
    {
      $push: { trainigData: feedback },
    }
  );

  console.log(`trainigData updated`);
  return res;
}

async function getResponses() {
  const responses = await Responses.find({}); 

  return responses;
}

getTraingData();

module.exports = {
  getTraingData,
  updateTraingData,
  getResponses,
};
