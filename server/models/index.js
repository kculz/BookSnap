const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const basename = path.basename(__filename);

const models = {};

// Phase 1: Load all model files without associations
function loadModels(sequelize) {
  fs.readdirSync(__dirname)
    .filter(file => {
      return (
        file !== basename &&
        file.slice(-3) === '.js' &&
        !file.includes('.test.js')
      );
    })
    .forEach(file => {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      models[model.name] = model;
    });

  return models;
}

// Phase 2: Setup associations
function setupAssociations(models) {
  Object.keys(models).forEach(modelName => {
    if (typeof models[modelName].associate === 'function') {
      models[modelName].associate(models);
    }
  });
}

module.exports = {
  loadModels,
  setupAssociations,
  models
};