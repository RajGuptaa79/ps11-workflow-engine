const resolveInputMapping = require("./inputResolver");

function evaluateCondition(
  condition,
  triggerPayload,
  stepOutputs
) {
  // No condition = step should run
  if (!condition) {
    return true;
  }

  let fieldReference = condition.field;

  // Supports both:
  // "stock_type"
  // "{{trigger.stock_type}}"
  if (
    typeof fieldReference === "string" &&
    !fieldReference.startsWith("{{")
  ) {
    fieldReference = `{{trigger.${fieldReference}}}`;
  }

  const resolved = resolveInputMapping(
    {
      fieldValue: fieldReference,
    },
    triggerPayload,
    stepOutputs
  );

  const actualValue = resolved.fieldValue;
  const expectedValue = condition.value;

  switch (condition.operator) {
    case "eq":
      return actualValue === expectedValue;

    case "neq":
      return actualValue !== expectedValue;

    case "gt":
      return actualValue > expectedValue;

    case "gte":
      return actualValue >= expectedValue;

    case "lt":
      return actualValue < expectedValue;

    case "lte":
      return actualValue <= expectedValue;

    default:
      return false;
  }
}

module.exports = evaluateCondition;