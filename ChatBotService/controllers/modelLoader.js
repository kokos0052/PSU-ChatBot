const Sequential = require("../models/sequentialModel");

// Функция сохранения модели в базу данных
async function saveModelToDB(model) {
  // Преобразуем модель в JSON-строку
  console.log(model);
  const modelJson = model.toJSON();

  // Создаем новую запись модели в базе данных
  const newModel = new Sequential({ modelJson });
  await newModel.save();
  console.log("Модель успешно сохранена в базе данных");
}

// Функция загрузки модели из базы данных
async function loadModelFromDB() {
  // Извлекаем последнюю сохраненную модель из базы данных
  const savedModel = await Sequential.findOne();
  console.log(savedModel);

  // Если модель найдена, загружаем ее из JSON-строки
  if (savedModel) {
    const modelJson = JSON.parse(savedModel.modelJson);
    const loadedModel = await tf.loadLayersModel(tf.io.fromJSON(modelJson));
    console.log("Модель успешно загружена из базы данных");
    return loadedModel;
  } else {
    console.error("Модель не найдена в базе данных");
    return null;
  }
}

module.exports = {
    saveModelToDB,
    loadModelFromDB,
}
