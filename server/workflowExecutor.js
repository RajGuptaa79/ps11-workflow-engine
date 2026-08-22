const resolveInputMapping = require("./inputResolver");
const evaluateCondition = require("./conditionEvaluator");
const executeAction = require("./actionExecutor");
async function executeWorkflow(workflow, run) {
  const orderedSteps = [...workflow.steps].sort(
    (a, b) => a.order - b.order
  );
const stepOutputs = {};

  for (const step of orderedSteps) {
    const startTime = Date.now();
    const conditionPassed = evaluateCondition(
  step.condition,
  run.triggerPayload,
  stepOutputs
);

if (!conditionPassed) {
  // Condition failed but workflow says skip this step
  if (step.onFailure === "skip") {
    console.log(`Skipping ${step.stepId}: condition not met`);

    run.stepResults.push({
      stepId: step.stepId,
      status: "skipped",
      output: {
        message: "Condition not met",
      },
      durationMs: Date.now() - startTime,
    });

    await run.save();
    continue;
  }

  // Otherwise stop the workflow
  console.log(`Aborting at ${step.stepId}: condition not met`);

  run.stepResults.push({
    stepId: step.stepId,
    status: "failed",
    output: {
      message: "Condition not met",
    },
    durationMs: Date.now() - startTime,
  });

  run.status = "failed";
  run.completedAt = new Date();

  await run.save();

  return run;
}
const resolvedInput = resolveInputMapping(
  step.inputMapping,
  run.triggerPayload,
  stepOutputs
);
    console.log(
      `Running ${step.stepId}: ${step.name}`
    );

    // For now we are testing the execution sequence only.
    // Real function/form/operation execution comes in later steps.
 const output = await executeAction(
  workflow,
  step,
  resolvedInput
);

stepOutputs[step.stepId] = output;

    run.stepResults.push({
      stepId: step.stepId,
      status: "success",
      output,
      durationMs: Date.now() - startTime,
    });

    // Save after every step
    await run.save();
  }

  // We use partial for now because real actions
  // are not connected yet.
  run.status = "partial";
  run.completedAt = new Date();

  await run.save();

  return run;
}

module.exports = executeWorkflow;