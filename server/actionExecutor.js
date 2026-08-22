const mongoose = require("mongoose");
const runFunction = require("./functionHandlers");
const runOperation = require("./operationHandlers");

async function executeAction(workflow, step, resolvedInput) {
  // FUNCTION
  if (step.actionType === "function") {
    const functionDefinition = await mongoose.connection
      .collection("custom_functions")
      .findOne({
        projectName: workflow.projectName,
        name: step.functionName,
        isActive: true,
        isDeleted: false,
      });

    if (!functionDefinition) {
      throw new Error(
        `Custom function not found: ${step.functionName}`
      );
    }

const result = await runFunction(
  step.functionName,
  resolvedInput
);

return result;
  }
  // OPERATION
if (step.actionType === "operation") {
  const buttonDefinition = await mongoose.connection
    .collection("buttons")
    .findOne({
      projectName: workflow.projectName,
      formId: step.formId,
      buttonId: step.buttonId,
      isActive: true,
      isDeleted: false,
    });

  if (!buttonDefinition) {
    throw new Error(
      `Operation button not found: ${step.buttonId}`
    );
  }

const result = await runOperation(
  step.buttonId,
  resolvedInput
);

return result;
}

  // FORM CREATE
  if (step.actionType === "formCreate") {
    if (!step.schema) {
      throw new Error("formCreate step is missing schema");
    }

    const dataToInsert = {
      ...resolvedInput,
      projectName: workflow.projectName,
      createdAt: new Date(),
    };

    const result = await mongoose.connection
      .collection(step.schema)
      .insertOne(dataToInsert);

    return {
      _id: result.insertedId,
      ...dataToInsert,
    };
  }

  // Other action types will be added next
  return {
    message: "Action type not connected yet",
    actionType: step.actionType,
    resolvedInput,
  };
}

module.exports = executeAction;