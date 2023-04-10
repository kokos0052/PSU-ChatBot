const tf = require('@tensorflow/tfjs-node');
const { saveModelToDB, loadModelFromDB } = require("./modelLoader");
const { getTraingData } = require('./trainigData');

// Функция обучения модели
async function trainModel() {
  const trainData = getTraingData();
  // Создаем пустую модель с одним входным слоем
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [trainData[0].input.length], units: 8, activation: 'relu' }));

  // Добавляем скрытые слои
  model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));

  // Добавляем выходной слой
  model.add(tf.layers.dense({ units: trainData[0].output.length, activation: 'softmax' }));

  // Компилируем модель
  model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy' });

  // Преобразуем данные обучения в тензоры
  const xs = trainData.map(item => tf.tensor2d([item.input], [1, item.input.length]));
  const ys = trainData.map(item => tf.tensor2d([item.output], [1, item.output.length]));

  // Обучаем модель
  await model.fit(xs, ys, { epochs: 100 });

  // Сохраняем модель в базу данных
  await saveModelToDB(model);

  // Освобождаем память от тензоров
  xs.forEach(tensor => tensor.dispose());
  ys.forEach(tensor => tensor.dispose());

  console.log('Модель успешно обучена и сохранена');
}

// Функция предсказания с использованием загруженной модели
async function predict(inputData) {
  // Загружаем модель из базы данных
  const loadedModel = await loadModelFromDB();

  // Преобразуем входные данные в тензор
  const input = tf.tensor2d([inputData], [1, inputData.length]);
  // Если модель загружена успешно, выполняем предсказание
  if (loadedModel) {
    // Выполняем предсказание
    const output = loadedModel.predict(input);

    // Преобразуем выходные данные в массив
    const result = output.dataSync();

    // Освобождаем память от тензоров
    input.dispose();
    output.dispose();

    console.log('Результат предсказания:', result);
    return result;
  } else {
    console.error('Модель не загружена из базы данных');
    return null;
  }
}

// // Пример использования бота
// (async () => {
//   // Загружаем данные для обучения модели
//   const inputData = [
//     { label: 'label1', input: [0, 1, 0], output: [1, 0, 0] },
//     { label: 'label2', input: [1, 0, 0], output: [0, 1, 0] },
//     { label: 'label3', input: [0, 0, 1], output: [0, 0, 1] }
//   ];

//   // Обучаем модель
//   await trainModel(inputData);

//   // Выполняем предсказание
//   const input = [1, 0, 0];
//   const output = predict(input);

//   // Используем результат предсказания
//   if (output) {
//     const labelIndex = output.indexOf(Math.max(...output));
//     const label = inputData[labelIndex].label;
//     console.log('Предсказанный класс:', label);
//   } else {
//     console.error('Предсказание не выполнено');
//   }
// })();

module.exports = {
  predict,
  trainModel,
};