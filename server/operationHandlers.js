const operationHandlers = {
  "update-inventory-button": async (input) => {
    return {
      itemId: input.id,
      projectName: input.projectName,
      updated: true,
    };
  },
};

async function runOperation(buttonId, input) {
  const handler = operationHandlers[buttonId];

  if (!handler) {
    throw new Error(
      `No executable operation found for: ${buttonId}`
    );
  }

  return handler(input);
}

module.exports = runOperation;