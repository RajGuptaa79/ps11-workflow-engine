const mongoose = require("mongoose");

async function getProjectContext(projectName) {
  const database = mongoose.connection;

  const [formSchemas, customFunctions, buttons, buttonConditions] =
    await Promise.all([
      database
        .collection("form_schemas")
        .find({
          projectName,
          isActive: true,
          isDeleted: false,
        })
        .toArray(),

      database
        .collection("custom_functions")
        .find({
          projectName,
          isActive: true,
          isDeleted: false,
        })
        .toArray(),

      database
        .collection("buttons")
        .find({
          projectName,
          isActive: true,
          isDeleted: false,
        })
        .toArray(),

      database
        .collection("button_conditions")
        .find({
          projectName,
          isActive: true,
          isDeleted: false,
        })
        .toArray(),
    ]);

  return {
    projectName,
    formSchemas,
    customFunctions,
    buttons,
    buttonConditions,
  };
}

module.exports = getProjectContext;