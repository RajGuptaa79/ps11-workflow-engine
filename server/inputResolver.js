function getValueByPath(object, path) {
  return path.split(".").reduce((current, key) => {
    if (current === undefined || current === null) {
      return undefined;
    }

    return current[key];
  }, object);
}

function resolveValue(value, triggerPayload, stepOutputs) {
  if (typeof value === "string") {
    const match = value.match(/^\{\{(.+)\}\}$/);

    if (!match) {
      return value;
    }

    const reference = match[1].trim();

    // Example: {{trigger.totalAmount}}
    if (reference.startsWith("trigger.")) {
      const path = reference.substring("trigger.".length);

      return getValueByPath(triggerPayload, path);
    }

    // Example: {{step-001.vendorId}}
    const firstDot = reference.indexOf(".");

    if (firstDot !== -1) {
      const stepId = reference.substring(0, firstDot);
      const path = reference.substring(firstDot + 1);

      const stepOutput = stepOutputs[stepId];

      return getValueByPath(stepOutput, path);
    }

    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      resolveValue(item, triggerPayload, stepOutputs)
    );
  }

  if (value && typeof value === "object") {
    const resolvedObject = {};

    for (const [key, item] of Object.entries(value)) {
      resolvedObject[key] = resolveValue(
        item,
        triggerPayload,
        stepOutputs
      );
    }

    return resolvedObject;
  }

  return value;
}

function resolveInputMapping(
  inputMapping,
  triggerPayload,
  stepOutputs
) {
  return resolveValue(
    inputMapping || {},
    triggerPayload,
    stepOutputs
  );
}

module.exports = resolveInputMapping;