const tf = require("@tensorflow/tfjs");
const fs = require("fs");

const classifier = tf.sequential();

let trainingData;

fs.readFile("answers.json", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  }

  trainingData = JSON.parse(data).answers;
});

classifier.add(
  tf.layers.dense({ inputShape: [trainingData[0].input.length || 1], units: 8 })
);
classifier.add(tf.layers.dense({ units: 8 }));
classifier.add(
  tf.layers.dense({ units: [trainingData[0].output.length || 1] })
);

classifier.compile({
  loss: "meanSquaredError",
  optimizer: "sgd",
});

const xs = trainingData.map((item) =>
  tf.tensor(
    Array.from(item.input).map((char) => char.charCodeAt(0)),
    [1, item.input.length]
  )
);

const ys = trainingData.map((item) =>
  tf.tensor(
    Array.from(item.output).map((char) => char.charCodeAt(0)),
    [1, item.output.length]
  )
);

classifier.fit(xs, ys, { epochs: 500 });

function updateModel(input, output) {
  const xs = tf.tensor2d([input]);
  const ys = tf.tensor2d([output]);

  classifier.fit(xs, ys, { epochs: 1 }).then(() => {
    console.log("Модель обновлена");
  });
}

function getAnswer(question) {
  const predict = classifier.predict(tf.tensor2d([question]));
  const answer = predict.arraySync()[0][0];
  console.log(`Ответ: ${answer}`);

  updateModel(question, answer);
  trainingData.push({ input: question, output: answer });
  fs.writeFile(
    "answers.json",
    JSON.stringify({ answers: trainingData }),
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );

  return answer;
}

module.exports = getAnswer;
